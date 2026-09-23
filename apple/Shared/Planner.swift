// How the Apple version reminds. In the browser, an alarm wakes the extension
// and it shows one reminder, then sets the next alarm. On iPhone, iPad and Mac
// nothing of ours runs when a reminder is due, so the app hands the system a
// run of reminders ahead of time, each one already chosen, worded and timed,
// and tops the run up whenever it gets the chance (the app opening, a
// background refresh, the Safari extension waking). Pure: no system APIs.

import Foundation

enum Planner {
    /// iOS keeps at most 64 pending notifications per app; leave room for "Send one now".
    static let maxPending = 60
    /// How far ahead to plan.
    static let horizon: TimeInterval = 4 * 24 * 3600

    struct Result: Equatable {
        var state: RuntimeState
        /// Reminders to hand to the system.
        var add: [Planned]
        /// Withdraw everything pending before adding.
        var withdrawAll: Bool
    }

    static func topUp(settings s: Settings, state: RuntimeState, now: Date, ids: [String],
                      rand: () -> Double = { Double.random(in: 0..<1) },
                      calendar: Calendar = .current) -> Result {
        var st = state
        let nowMs = now.timeIntervalSince1970 * 1000

        // what has already been shown
        let shown = st.plan.filter { $0.fireAt <= nowMs }
        if let last = shown.last {
            st.lastFiredAt = last.fireAt
            st.lastReminderId = last.id
        }
        var upcoming = st.plan.filter { $0.fireAt > nowMs }
        var withdrawAll = false

        // Off, or the settings changed since this plan was made: withdraw what
        // is pending and put its reminders back at the front of the cycle.
        if !s.enabled || st.plannedFor != s {
            withdrawAll = true
            st.cycle = upcoming.map(\.id) + st.cycle.filter { id in !upcoming.contains { $0.id == id } }
            st.lastPlannedId = st.lastReminderId
            upcoming = []
        }

        guard s.enabled, !ids.isEmpty else {
            st.plan = []
            st.nextFireAt = nil
            st.plannedFor = s.enabled ? s : nil
            return Result(state: st, add: [], withdrawAll: withdrawAll)
        }

        var add: [Planned] = []
        var cursor = upcoming.last?.date ?? now
        let limit = now.addingTimeInterval(horizon)
        while upcoming.count + add.count < maxPending {
            let at = Schedule.nextFire(after: cursor, s, rand: rand, calendar: calendar)
            if at > limit { break }
            guard let pick = Selection.pickNext(cycle: st.cycle, last: st.lastPlannedId, ids: ids, rand: rand) else { break }
            st.cycle = pick.cycle
            st.lastPlannedId = pick.id
            add.append(Planned(id: pick.id, fireAt: (at.timeIntervalSince1970 * 1000).rounded()))
            cursor = at
        }

        st.plan = upcoming + add
        st.nextFireAt = st.plan.first?.fireAt
        st.plannedFor = s
        return Result(state: st, add: add, withdrawAll: withdrawAll)
    }

    /// The schedule as the extension's popup reads it (RuntimeState in settings.ts):
    /// the cycle it sees starts with the reminders already planned.
    static func webState(_ st: RuntimeState) -> [String: Any] {
        var out: [String: Any] = ["cycle": st.plan.map(\.id) + st.cycle]
        out["nextFireAt"] = st.nextFireAt.map { $0 as Any } ?? NSNull()
        out["lastFiredAt"] = st.lastFiredAt.map { $0 as Any } ?? NSNull()
        out["lastReminderId"] = st.lastReminderId.map { $0 as Any } ?? NSNull()
        return out
    }
}
