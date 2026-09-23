// Pure scheduling logic, a port of extension/src/lib/schedule.ts and
// selection.ts. No system APIs here, so ScheduleTests can check it.

import Foundation

enum TimeOfDay {
    static func isTime(_ s: String) -> Bool {
        s.range(of: #"^([01]\d|2[0-3]):[0-5]\d$"#, options: .regularExpression) != nil
    }

    /// "HH:MM" → minutes since midnight.
    static func minutes(_ hhmm: String) -> Int {
        let parts = hhmm.split(separator: ":").compactMap { Int($0) }
        guard parts.count == 2 else { return 0 }
        return parts[0] * 60 + parts[1]
    }

    /// "8:30 pm", in the person's own locale.
    static func format(_ date: Date) -> String {
        date.formatted(date: .omitted, time: .shortened).lowercased()
    }
}

enum Schedule {
    static let minute: TimeInterval = 60

    static func quietHoursEnabled(_ s: Settings) -> Bool {
        s.quietEnabled && s.quietStart != s.quietEnd
    }

    /// True when `at` falls inside quiet hours (ranges may cross midnight).
    static func isQuiet(_ at: Date, _ s: Settings, calendar: Calendar = .current) -> Bool {
        guard quietHoursEnabled(s) else { return false }
        let c = calendar.dateComponents([.hour, .minute], from: at)
        let now = (c.hour ?? 0) * 60 + (c.minute ?? 0)
        let start = TimeOfDay.minutes(s.quietStart)
        let end = TimeOfDay.minutes(s.quietEnd)
        if start < end { return now >= start && now < end }
        return now >= start || now < end // e.g. 22:00 → 07:00
    }

    /// The next moment quiet hours end, after `at`.
    static func quietEnd(after at: Date, _ s: Settings, calendar: Calendar = .current) -> Date {
        let m = TimeOfDay.minutes(s.quietEnd)
        var end = calendar.date(bySettingHour: m / 60, minute: m % 60, second: 0, of: at) ?? at
        if end <= at { end = calendar.date(byAdding: .day, value: 1, to: end) ?? end }
        return end
    }

    /// When the reminder after `from` should arrive.
    /// - randomize stretches or shortens the interval by up to 25 %;
    /// - a reminder that would land in quiet hours moves to just after they
    ///   end (plus a few random minutes when randomize is on);
    /// - never sooner than one minute after `from`.
    static func nextFire(after from: Date, _ s: Settings, rand: () -> Double = { Double.random(in: 0..<1) },
                         calendar: Calendar = .current) -> Date {
        let interval = TimeInterval(s.intervalMinutes) * minute
        var delay = interval
        if s.randomize { delay = (interval * (0.75 + rand() * 0.5)).rounded() }
        var next = from.addingTimeInterval(delay)
        if isQuiet(next, s, calendar: calendar) {
            next = quietEnd(after: next, s, calendar: calendar)
            if s.randomize { next = next.addingTimeInterval((rand() * 15 * minute).rounded()) }
        }
        if next.timeIntervalSince(from) < minute { next = from.addingTimeInterval(minute) }
        return next
    }

    static func describe(_ s: Settings) -> String {
        let m = s.intervalMinutes
        if m % 60 == 0 { return m == 60 ? "1 hour" : "\(m / 60) hours" }
        if m > 60 { return "\(m / 60) h \(m % 60) min" }
        return "\(m) minutes"
    }
}

/// Which reminder comes next. A cycle is a shuffled list of every reminder;
/// take from the front until it is empty, then reshuffle. The same reminder
/// never shows twice in a row, even across the boundary between cycles.
enum Selection {
    static func pickNext(cycle: [String], last: String?, ids: [String],
                         rand: () -> Double = { Double.random(in: 0..<1) }) -> (id: String, cycle: [String])? {
        var cycle = cycle.filter { ids.contains($0) }
        if cycle.isEmpty {
            cycle = shuffle(ids, rand: rand)
            if cycle.count > 1, cycle[0] == last {
                let other = 1 + Int(rand() * Double(cycle.count - 1))
                cycle.swapAt(0, min(other, cycle.count - 1))
            }
        }
        guard let first = cycle.first else { return nil }
        return (first, Array(cycle.dropFirst()))
    }

    static func shuffle<T>(_ items: [T], rand: () -> Double) -> [T] {
        var a = items
        guard a.count > 1 else { return a }
        for i in stride(from: a.count - 1, to: 0, by: -1) {
            let j = min(i, Int(rand() * Double(i + 1)))
            a.swapAt(i, j)
        }
        return a
    }
}
