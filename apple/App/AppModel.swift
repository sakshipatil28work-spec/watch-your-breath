// What the screens read and change: the settings, the schedule, whether
// notifications are allowed, and the reminder opened from a notification.
// Every change saves to the App Group (so the Safari extension sees it) and
// replans the reminders.

import AVFoundation
import SwiftUI
import UserNotifications

@MainActor
final class AppModel: ObservableObject {
    static let shared = AppModel()

    @Published private(set) var settings = SharedStore.loadSettings()
    @Published private(set) var state = SharedStore.loadState()
    @Published private(set) var notificationsAllowed = true
    /// The reminder whose notification was tapped, shown full size.
    @Published var opened: Reminder?
    @Published var settingsOpen = false

    private var refreshing: Task<Void, Never>?
    private var bell: AVAudioPlayer?

    init() {
        #if DEBUG
        // CI photographs each screen in the simulator: launch with `-wyb-screen <name>`
        if let screen = UserDefaults.standard.string(forKey: "wyb-screen") { show(screen) }
        #endif
    }

    #if DEBUG
    private func show(_ screen: String) {
        var s = Settings()
        s.enabled = screen != "onboarding"
        s.onboarded = screen != "onboarding"
        settings = s
        SharedStore.saveSettings(s)
        settingsOpen = screen == "settings"
        if screen == "reminder" { opened = ReminderLibrary.all.first }
    }
    #endif

    // MARK: settings

    /// A binding that saves and replans on change.
    func binding<T: Equatable>(_ key: WritableKeyPath<Settings, T>) -> Binding<T> {
        Binding(get: { self.settings[keyPath: key] }, set: { v in self.update { $0[keyPath: key] = v } })
    }

    func update(_ change: (inout Settings) -> Void) {
        var next = settings
        change(&next)
        guard next != settings else { return }
        settings = next
        SharedStore.saveSettings(next)
        refresh()
    }

    /// First run: ask for notifications, then start.
    func start(interval: IntervalChoice, customMinutes: Int, layout: NotificationLayout, sound: Bool) async {
        _ = await ReminderCenter.requestPermission()
        update {
            $0.enabled = true
            $0.interval = interval
            $0.customMinutes = customMinutes
            $0.layout = layout
            $0.soundEnabled = sound
            $0.onboarded = true
        }
    }

    // MARK: schedule

    /// Re-read what the Safari extension may have changed, and top up the
    /// schedule. Runs one at a time, so two quick changes never plan twice.
    func refresh() {
        let previous = refreshing
        refreshing = Task {
            await previous?.value
            let latest = SharedStore.loadSettings()
            if latest != settings { settings = latest }
            state = await ReminderCenter.refresh()
            notificationsAllowed = await ReminderCenter.notificationsAllowed()
        }
    }

    func sendOneNow() async -> Bool {
        let ok = await ReminderCenter.sendOneNow()
        state = SharedStore.loadState()
        return ok
    }

    /// The reminder that comes next, as its notification will read.
    var upcoming: Reminder? {
        let now = Date().timeIntervalSince1970 * 1000
        let id = state.plan.first { $0.fireAt > now }?.id ?? state.cycle.first
        return ReminderLibrary.all.first { $0.id == id }
            ?? ReminderLibrary.all.first { $0.id != state.lastReminderId }
    }

    // MARK: status line

    enum Tone { case off, on, quiet, active }

    func status(at now: Date = Date()) -> (text: String, tone: Tone) {
        let justFired = state.lastFiredAt.map { now.timeIntervalSince1970 * 1000 - $0 < 90_000 } ?? false
        if !settings.enabled { return ("Reminders are off. Switch them on when you’re ready.", .off) }
        if justFired { return ("Just a moment.", .active) }
        if Schedule.isQuiet(now, settings) {
            let until = TimeOfDay.format(Schedule.quietEnd(after: now, settings))
            return ("Quiet hours until \(until). Reminders pick up after.", .quiet)
        }
        if let next = state.nextFireAt {
            return ("Next reminder around \(TimeOfDay.format(Date(timeIntervalSince1970: next / 1000))).", .on)
        }
        return ("Setting the next reminder…", .on)
    }

    // MARK: bell

    /// The bell, once. Returns false when it cannot play.
    func playBell() -> Bool {
        guard let url = Bundle.main.url(forResource: "reminder-bell", withExtension: "caf") else { return false }
        #if os(iOS)
        // respect the silent switch, and never interrupt other audio
        try? AVAudioSession.sharedInstance().setCategory(.ambient, options: [.mixWithOthers])
        #endif
        bell?.stop()
        guard let player = try? AVAudioPlayer(contentsOf: url) else { return false }
        player.volume = 0.7
        bell = player
        return player.play()
    }

    // MARK: notifications

    func open(reminderId: String) {
        opened = ReminderLibrary.all.first { $0.id == reminderId }
    }
}

/// Shows reminders even while the app is open, and opens the tapped one.
final class NotificationDelegate: NSObject, UNUserNotificationCenterDelegate {
    static let shared = NotificationDelegate()

    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification) async
        -> UNNotificationPresentationOptions {
        [.banner, .list, .sound]
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse) async {
        guard response.actionIdentifier == UNNotificationDefaultActionIdentifier,
              let id = response.notification.request.content.userInfo[ReminderCenter.reminderIdKey] as? String
        else { return }
        await MainActor.run { AppModel.shared.open(reminderId: id) }
    }
}
