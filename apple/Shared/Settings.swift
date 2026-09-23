// User preferences, the same schema as the extension (extension/src/lib/settings.ts),
// so the Safari extension and the app can hand them to each other as JSON.
// Stored in the App Group's defaults, shared by the app and its extension.
// No account, no backend.

import Foundation

enum IntervalChoice: Hashable, Codable {
    case minutes(Int) // 30, 60 or 120
    case custom

    static let presets: [IntervalChoice] = [.minutes(30), .minutes(60), .minutes(120), .custom]

    init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if let s = try? c.decode(String.self), s == "custom" { self = .custom; return }
        if let n = try? c.decode(Int.self), [30, 60, 120].contains(n) { self = .minutes(n); return }
        self = .minutes(60)
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.singleValueContainer()
        switch self {
        case .minutes(let n): try c.encode(n)
        case .custom: try c.encode("custom")
        }
    }
}

/// Compact: the drawing and the reminder. Expanded: the same, with the short reflection.
enum NotificationLayout: String, Codable, Hashable { case compact, expanded }

struct Settings: Codable, Equatable {
    var enabled = false
    var interval: IntervalChoice = .minutes(60)
    /// Minutes used when interval is .custom.
    var customMinutes = 45
    /// Stretch or shorten each interval by up to 25 %.
    var randomize = false
    /// Quiet hours, as "HH:MM" 24h.
    var quietEnabled = true
    var quietStart = "22:00"
    var quietEnd = "07:00"
    var layout: NotificationLayout = .compact
    var soundEnabled = true
    /// First-run has been completed.
    var onboarded = false

    static let customRange = 5...720

    var intervalMinutes: Int {
        switch interval {
        case .minutes(let n): return n
        case .custom: return min(Self.customRange.upperBound, max(Self.customRange.lowerBound, customMinutes))
        }
    }

    init() {}

    /// Lenient, like sanitize() in settings.ts: anything missing or malformed falls back to its default.
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        let d = Settings()
        enabled = (try? c.decode(Bool.self, forKey: .enabled)) ?? d.enabled
        interval = (try? c.decode(IntervalChoice.self, forKey: .interval)) ?? d.interval
        if let n = try? c.decode(Double.self, forKey: .customMinutes), n.isFinite {
            customMinutes = Int(n.rounded())
        }
        randomize = (try? c.decode(Bool.self, forKey: .randomize)) ?? d.randomize
        quietEnabled = (try? c.decode(Bool.self, forKey: .quietEnabled)) ?? d.quietEnabled
        if let s = try? c.decode(String.self, forKey: .quietStart), TimeOfDay.isTime(s) { quietStart = s }
        if let s = try? c.decode(String.self, forKey: .quietEnd), TimeOfDay.isTime(s) { quietEnd = s }
        layout = (try? c.decode(NotificationLayout.self, forKey: .layout)) ?? d.layout
        soundEnabled = (try? c.decode(Bool.self, forKey: .soundEnabled)) ?? d.soundEnabled
        onboarded = (try? c.decode(Bool.self, forKey: .onboarded)) ?? d.onboarded
    }
}

/// One reminder the system has been asked to show.
struct Planned: Codable, Equatable {
    let id: String
    /// Epoch milliseconds, as in the extension.
    let fireAt: Double

    var date: Date { Date(timeIntervalSince1970: fireAt / 1000) }
    var requestId: String { "wyb.\(Int64(fireAt))" }
}

/// What the app keeps about the schedule; not preferences.
struct RuntimeState: Codable, Equatable {
    /// Epoch ms of the next reminder, or nil when off.
    var nextFireAt: Double?
    /// Epoch ms of the last reminder that was shown.
    var lastFiredAt: Double?
    /// Reminder ids not yet planned in the current cycle.
    var cycle: [String] = []
    /// The reminder shown most recently.
    var lastReminderId: String?
    /// The reminder planned most recently; the next pick never repeats it.
    var lastPlannedId: String?
    /// Reminders handed to the system and not yet shown, in order.
    var plan: [Planned] = []
    /// The settings the plan was made for; a change replans from now.
    var plannedFor: Settings?
}

/// The App Group both the app and its Safari extension read and write.
enum SharedStore {
    static let appGroup = "group.dev.sakshipatil.WatchYourBreath"
    private static let settingsKey = "settings"
    private static let stateKey = "state"

    static var defaults: UserDefaults { UserDefaults(suiteName: appGroup) ?? .standard }

    static func loadSettings() -> Settings {
        guard let data = defaults.data(forKey: settingsKey) else { return Settings() }
        return (try? JSONDecoder().decode(Settings.self, from: data)) ?? Settings()
    }

    static func saveSettings(_ s: Settings) {
        if let data = try? JSONEncoder().encode(s) { defaults.set(data, forKey: settingsKey) }
    }

    static func loadState() -> RuntimeState {
        guard let data = defaults.data(forKey: stateKey) else { return RuntimeState() }
        return (try? JSONDecoder().decode(RuntimeState.self, from: data)) ?? RuntimeState()
    }

    static func saveState(_ s: RuntimeState) {
        if let data = try? JSONEncoder().encode(s) { defaults.set(data, forKey: stateKey) }
    }
}
