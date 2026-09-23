// The Apple port of the extension's timing and choosing, checked against the
// same rules: quiet hours, randomizing, the shuffled cycle, and the plan the
// app hands to the system.

import XCTest

private let utc: Calendar = {
    var c = Calendar(identifier: .gregorian)
    c.timeZone = TimeZone(identifier: "UTC")!
    return c
}()

private func at(_ h: Int, _ m: Int, day: Int = 1) -> Date {
    utc.date(from: DateComponents(year: 2026, month: 3, day: day, hour: h, minute: m))!
}

private let ids = (1...12).map { "r\($0)" }

/// A repeatable stand-in for Math.random().
private struct Seeded {
    var state: UInt64
    mutating func next() -> Double {
        state = state &* 6364136223846793005 &+ 1442695040888963407
        return Double(state >> 11) / Double(1 << 53)
    }
}

final class ScheduleTests: XCTestCase {
    func testQuietHoursCrossingMidnight() {
        let s = Settings() // 22:00 → 07:00
        XCTAssertTrue(Schedule.isQuiet(at(22, 0), s, calendar: utc))
        XCTAssertTrue(Schedule.isQuiet(at(6, 59), s, calendar: utc))
        XCTAssertFalse(Schedule.isQuiet(at(7, 0), s, calendar: utc))
        XCTAssertFalse(Schedule.isQuiet(at(12, 0), s, calendar: utc))
    }

    func testQuietHoursWithinADay() {
        var s = Settings()
        s.quietStart = "13:00"
        s.quietEnd = "14:00"
        XCTAssertTrue(Schedule.isQuiet(at(13, 30), s, calendar: utc))
        XCTAssertFalse(Schedule.isQuiet(at(14, 0), s, calendar: utc))
    }

    func testQuietHoursOffWhenStartEqualsEndOrDisabled() {
        var s = Settings()
        s.quietStart = "09:00"
        s.quietEnd = "09:00"
        XCTAssertFalse(Schedule.isQuiet(at(9, 0), s, calendar: utc))
        s = Settings()
        s.quietEnabled = false
        XCTAssertFalse(Schedule.isQuiet(at(23, 0), s, calendar: utc))
    }

    func testAReminderDueInQuietHoursWaitsUntilTheyEnd() {
        let s = Settings() // every hour
        let next = Schedule.nextFire(after: at(21, 30), s, calendar: utc)
        XCTAssertEqual(next, at(7, 0, day: 2))
    }

    func testRandomizeStaysWithinAQuarter() {
        var s = Settings()
        s.randomize = true
        s.quietEnabled = false
        XCTAssertEqual(Schedule.nextFire(after: at(10, 0), s, rand: { 0 }, calendar: utc), at(10, 45))
        XCTAssertEqual(Schedule.nextFire(after: at(10, 0), s, rand: { 1 }, calendar: utc), at(11, 15))
    }

    func testCustomMinutesAreClamped() {
        var s = Settings()
        s.interval = .custom
        s.customMinutes = 1
        XCTAssertEqual(s.intervalMinutes, 5)
        s.customMinutes = 10_000
        XCTAssertEqual(s.intervalMinutes, 720)
    }

    func testDescribe() {
        var s = Settings()
        XCTAssertEqual(Schedule.describe(s), "1 hour")
        s.interval = .custom
        s.customMinutes = 90
        XCTAssertEqual(Schedule.describe(s), "1 h 30 min")
        s.customMinutes = 45
        XCTAssertEqual(Schedule.describe(s), "45 minutes")
    }
}

final class SelectionTests: XCTestCase {
    func testEveryReminderShowsBeforeAnyRepeats() {
        var rng = Seeded(state: 7)
        var cycle: [String] = []
        var last: String?
        var seen: [String] = []
        for _ in ids {
            let pick = Selection.pickNext(cycle: cycle, last: last, ids: ids, rand: { rng.next() })!
            seen.append(pick.id)
            cycle = pick.cycle
            last = pick.id
        }
        XCTAssertEqual(Set(seen), Set(ids))
    }

    func testNeverTheSameTwiceInARow() {
        var rng = Seeded(state: 42)
        var cycle: [String] = []
        var last: String?
        for _ in 0..<2_000 {
            let pick = Selection.pickNext(cycle: cycle, last: last, ids: ids, rand: { rng.next() })!
            XCTAssertNotEqual(pick.id, last)
            cycle = pick.cycle
            last = pick.id
        }
    }
}

final class PlannerTests: XCTestCase {
    private func enabled() -> Settings {
        var s = Settings()
        s.enabled = true
        s.onboarded = true
        return s
    }

    func testAFirstPlanIsOrderedBoundedAndVaried() {
        var rng = Seeded(state: 1)
        let r = Planner.topUp(settings: enabled(), state: RuntimeState(), now: at(9, 0), ids: ids, rand: { rng.next() }, calendar: utc)
        let plan = r.state.plan
        XCTAssertTrue(r.withdrawAll)
        XCTAssertEqual(plan, r.add)
        XCTAssertFalse(plan.isEmpty)
        XCTAssertLessThanOrEqual(plan.count, Planner.maxPending)
        XCTAssertEqual(plan.map(\.fireAt), plan.map(\.fireAt).sorted())
        XCTAssertEqual(r.state.nextFireAt, plan.first?.fireAt)
        XCTAssertEqual(plan.first?.date, at(10, 0))
        for (a, b) in zip(plan, plan.dropFirst()) { XCTAssertNotEqual(a.id, b.id) }
        for p in plan { XCTAssertFalse(Schedule.isQuiet(p.date, enabled(), calendar: utc)) }
    }

    func testTopingUpAgainAddsNothing() {
        var rng = Seeded(state: 2)
        let first = Planner.topUp(settings: enabled(), state: RuntimeState(), now: at(9, 0), ids: ids, rand: { rng.next() }, calendar: utc)
        let again = Planner.topUp(settings: enabled(), state: first.state, now: at(9, 5), ids: ids, rand: { rng.next() }, calendar: utc)
        XCTAssertFalse(again.withdrawAll)
        XCTAssertTrue(again.add.isEmpty)
        XCTAssertEqual(again.state.plan, first.state.plan)
    }

    func testShownRemindersAreRecordedAndReplaced() {
        var rng = Seeded(state: 3)
        let first = Planner.topUp(settings: enabled(), state: RuntimeState(), now: at(9, 0), ids: ids, rand: { rng.next() }, calendar: utc)
        let third = first.state.plan[2]
        let later = Planner.topUp(settings: enabled(), state: first.state, now: third.date.addingTimeInterval(60), ids: ids, rand: { rng.next() }, calendar: utc)
        XCTAssertEqual(later.state.lastReminderId, third.id)
        XCTAssertEqual(later.state.lastFiredAt, third.fireAt)
        XCTAssertEqual(later.state.plan.first, first.state.plan[3])
        XCTAssertEqual(later.state.plan.count, min(Planner.maxPending, first.state.plan.count + later.add.count - 3))
    }

    func testChangingSettingsReplansFromNow() {
        var rng = Seeded(state: 4)
        let first = Planner.topUp(settings: enabled(), state: RuntimeState(), now: at(9, 0), ids: ids, rand: { rng.next() }, calendar: utc)
        var s = enabled()
        s.interval = .minutes(30)
        let changed = Planner.topUp(settings: s, state: first.state, now: at(9, 10), ids: ids, rand: { rng.next() }, calendar: utc)
        XCTAssertTrue(changed.withdrawAll)
        XCTAssertEqual(changed.state.plan.first?.date, at(9, 40))
        // the reminder that was next is still next
        XCTAssertEqual(changed.state.plan.first?.id, first.state.plan.first?.id)
    }

    func testTurningOffWithdrawsEverything() {
        var rng = Seeded(state: 5)
        let first = Planner.topUp(settings: enabled(), state: RuntimeState(), now: at(9, 0), ids: ids, rand: { rng.next() }, calendar: utc)
        let off = Planner.topUp(settings: Settings(), state: first.state, now: at(9, 10), ids: ids, rand: { rng.next() }, calendar: utc)
        XCTAssertTrue(off.withdrawAll)
        XCTAssertTrue(off.state.plan.isEmpty)
        XCTAssertNil(off.state.nextFireAt)
    }
}

final class SettingsCodingTests: XCTestCase {
    /// The popup's settings arrive as the extension stores them.
    func testDecodesTheExtensionsSettings() throws {
        let json = #"{"enabled":true,"interval":"custom","customMinutes":45,"randomize":false,"quietEnabled":true,"quietStart":"22:00","quietEnd":"07:00","layout":"expanded","soundEnabled":false,"onboarded":true}"#
        let s = try JSONDecoder().decode(Settings.self, from: Data(json.utf8))
        XCTAssertEqual(s.interval, .custom)
        XCTAssertEqual(s.layout, .expanded)
        XCTAssertFalse(s.soundEnabled)
        XCTAssertTrue(s.onboarded)
    }

    func testMalformedValuesFallBackToDefaults() throws {
        let json = #"{"enabled":true,"interval":45,"quietStart":"25:00","layout":"huge"}"#
        let s = try JSONDecoder().decode(Settings.self, from: Data(json.utf8))
        XCTAssertTrue(s.enabled)
        XCTAssertEqual(s.interval, .minutes(60))
        XCTAssertEqual(s.quietStart, "22:00")
        XCTAssertEqual(s.layout, .compact)
    }

    func testEncodesIntervalAsTheExtensionDoes() throws {
        var s = Settings()
        s.interval = .minutes(30)
        let obj = try JSONSerialization.jsonObject(with: JSONEncoder().encode(s)) as! [String: Any]
        XCTAssertEqual(obj["interval"] as? Int, 30)
        s.interval = .custom
        let obj2 = try JSONSerialization.jsonObject(with: JSONEncoder().encode(s)) as! [String: Any]
        XCTAssertEqual(obj2["interval"] as? String, "custom")
    }
}
