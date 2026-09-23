// The Safari extension's side of native messaging. The extension's background
// (extension/src/background/safari.ts) sends one of:
//   { type: "refresh" }                 top up the schedule, answer with it
//   { type: "settings", settings: {…} } the popup changed something: save, replan
//   { type: "preview" }                 "Send one now"
// and every answer carries the settings, the schedule as the popup reads it,
// and whether notifications are allowed.

import Foundation
import SafariServices

final class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems.first as? NSExtensionItem
        let message = item?.userInfo?[SFExtensionMessageKey] as? [String: Any] ?? [:]
        Task {
            let reply = await Self.handle(message)
            let response = NSExtensionItem()
            response.userInfo = [SFExtensionMessageKey: reply]
            context.completeRequest(returningItems: [response], completionHandler: nil)
        }
    }

    static func handle(_ message: [String: Any]) async -> [String: Any] {
        var ok = true
        switch message["type"] as? String {
        case "settings":
            if let raw = message["settings"],
               let data = try? JSONSerialization.data(withJSONObject: raw),
               let incoming = try? JSONDecoder().decode(Settings.self, from: data) {
                SharedStore.saveSettings(incoming)
            }
            await ReminderCenter.refresh()
        case "preview":
            ok = await ReminderCenter.sendOneNow()
        default: // "refresh"
            await ReminderCenter.refresh()
        }

        var reply: [String: Any] = [
            "ok": ok,
            "state": Planner.webState(SharedStore.loadState()),
            "notificationsAllowed": await ReminderCenter.notificationsAllowed(),
        ]
        if let data = try? JSONEncoder().encode(SharedStore.loadSettings()),
           let json = try? JSONSerialization.jsonObject(with: data) {
            reply["settings"] = json
        }
        return reply
    }
}
