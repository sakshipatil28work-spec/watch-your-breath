// The reminder library. Defined once, in extension/src/lib/reminders.ts, and
// exported as reminders.json by apple/scripts/export-reminders.mjs. Copy and
// illustration are designed together: each entry names the one drawing that
// carries its meaning. Never recombine.

import Foundation

struct Reminder: Codable, Identifiable, Hashable {
    enum Motion: String, Codable { case flow, ripple, drift, breathe }

    let id: String
    let title: String
    let supporting: String
    /// Optional longer reflection, shown only in the Expanded layout.
    let reflection: String?
    let illustrationId: String
    let motion: Motion
    /// One line describing the drawing, for VoiceOver.
    let alt: String

    /// The notification's words under the title: Expanded adds the reflection.
    func message(for layout: NotificationLayout) -> String {
        if layout == .expanded, let reflection { return "\(supporting)\n\(reflection)" }
        return supporting
    }
}

enum ReminderLibrary {
    static let all: [Reminder] = {
        guard
            let url = Bundle.main.url(forResource: "reminders", withExtension: "json"),
            let data = try? Data(contentsOf: url),
            let list = try? JSONDecoder().decode([Reminder].self, from: data)
        else { return [] }
        return list
    }()

    static var ids: [String] { all.map(\.id) }

    static func reminder(_ id: String?) -> Reminder? {
        all.first { $0.id == id } ?? all.first
    }

    /// "card": the bare drawing. "icon": the round disc. "wide": the 728×364 sand panel.
    enum Variant: String { case card, icon, wide }

    /// The drawing's file. The app carries them in illustrations/; the Safari
    /// extension carries the web extension's copy in assets/illustrations/.
    static func imageURL(_ r: Reminder, _ variant: Variant) -> URL? {
        let name = variant == .card ? r.illustrationId : "\(r.illustrationId)-\(variant.rawValue)"
        return Bundle.main.url(forResource: name, withExtension: "png", subdirectory: "illustrations")
            ?? Bundle.main.url(forResource: name, withExtension: "png", subdirectory: "assets/illustrations")
    }
}
