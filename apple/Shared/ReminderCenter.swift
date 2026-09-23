// Hands the planned reminders to the system as local notifications: the
// drawing, the reminder's words, and the bell once. Used by the app and by
// the Safari extension's handler, both reading the same App Group.

import CoreGraphics
import Foundation
import UserNotifications

enum ReminderCenter {
    private static let prefix = "wyb."
    static let previewRequestId = "wyb.preview"
    /// The author's bell, converted from the extension's mp3 (apple/scripts/prepare.sh).
    private static let bell = UNNotificationSoundName("reminder-bell.caf")
    /// Carried on each notification so a tap can open that reminder.
    static let reminderIdKey = "reminderId"

    private static var center: UNUserNotificationCenter { .current() }

    // MARK: permission

    /// Ask once, from the first-run screen.
    static func requestPermission() async -> Bool {
        (try? await center.requestAuthorization(options: [.alert, .sound])) ?? false
    }

    static func notificationsAllowed() async -> Bool {
        let status = await center.notificationSettings().authorizationStatus
        return status == .authorized || status == .provisional || status == .notDetermined
    }

    // MARK: schedule

    /// Brings the system's pending reminders in line with the settings. Safe to call often:
    /// it only adds what is missing, unless the settings changed.
    @discardableResult
    static func refresh(now: Date = Date()) async -> RuntimeState {
        let settings = SharedStore.loadSettings()
        let result = Planner.topUp(settings: settings, state: SharedStore.loadState(), now: now, ids: ReminderLibrary.ids)
        SharedStore.saveState(result.state)

        if result.withdrawAll {
            let pending = await center.pendingNotificationRequests()
            let ours = pending.map(\.identifier).filter { $0.hasPrefix(prefix) && $0 != previewRequestId }
            center.removePendingNotificationRequests(withIdentifiers: ours)
        }
        clearShown(olderThan: now.addingTimeInterval(-60))

        for planned in result.add {
            guard let r = ReminderLibrary.all.first(where: { $0.id == planned.id }) else { continue }
            let when = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute, .second], from: planned.date)
            let trigger = UNCalendarNotificationTrigger(dateMatching: when, repeats: false)
            let request = UNNotificationRequest(identifier: planned.requestId, content: content(r, settings), trigger: trigger)
            try? await center.add(request)
        }
        return result.state
    }

    /// "Send one now": the next reminder in the cycle, in a second.
    static func sendOneNow() async -> Bool {
        guard await notificationsAllowed() else { return false }
        let settings = SharedStore.loadSettings()
        var state = SharedStore.loadState()
        guard
            let pick = Selection.pickNext(cycle: state.cycle, last: state.lastPlannedId, ids: ReminderLibrary.ids),
            let r = ReminderLibrary.all.first(where: { $0.id == pick.id })
        else { return false }
        state.cycle = pick.cycle
        state.lastReminderId = r.id
        state.lastFiredAt = (Date().timeIntervalSince1970 * 1000).rounded()
        SharedStore.saveState(state)

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        let request = UNNotificationRequest(identifier: previewRequestId, content: content(r, settings), trigger: trigger)
        do {
            try await center.add(request)
            return true
        } catch {
            return false
        }
    }

    /// Reminders already shown leave Notification Center once they have had
    /// their moment, so nothing piles up there.
    static func clearShown(olderThan cutoff: Date) {
        center.getDeliveredNotifications { delivered in
            let old = delivered.filter { $0.request.identifier.hasPrefix(prefix) && $0.date < cutoff }
            center.removeDeliveredNotifications(withIdentifiers: old.map(\.request.identifier))
        }
    }

    // MARK: the notification itself

    private static func content(_ r: Reminder, _ s: Settings) -> UNMutableNotificationContent {
        let c = UNMutableNotificationContent()
        c.title = r.title
        c.body = r.message(for: s.layout)
        c.threadIdentifier = "wyb"
        c.userInfo = [reminderIdKey: r.id]
        c.sound = s.soundEnabled ? UNNotificationSound(named: bell) : nil
        c.interruptionLevel = .active
        c.relevanceScore = 0.2
        if let a = attachment(r) { c.attachments = [a] }
        return c
    }

    /// The drawing. On iPhone and iPad: the wide sand panel, its centre as the
    /// thumbnail and the whole panel when expanded. On the Mac, the round disc.
    private static func attachment(_ r: Reminder) -> UNNotificationAttachment? {
        #if os(iOS)
        let variant = ReminderLibrary.Variant.wide
        let options: [String: Any] = [
            UNNotificationAttachmentOptionsThumbnailClippingRectKey:
                CGRect(x: 0.25, y: 0, width: 0.5, height: 1).dictionaryRepresentation,
        ]
        #else
        let variant = ReminderLibrary.Variant.icon
        let options: [String: Any] = [:]
        #endif
        guard let source = ReminderLibrary.imageURL(r, variant) else { return nil }
        // the system moves an attachment's file into its own store, so hand it a copy
        let dir = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
        let copy = dir.appendingPathComponent(source.lastPathComponent)
        do {
            try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
            try FileManager.default.copyItem(at: source, to: copy)
            return try UNNotificationAttachment(identifier: r.illustrationId, url: copy, options: options)
        } catch {
            return nil
        }
    }
}
