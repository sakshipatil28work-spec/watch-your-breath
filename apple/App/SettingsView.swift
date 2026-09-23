// Settings: the popup's settings view, grouped under Eczar titles
// (Reminders, Notification, Sound, Quiet hours, Optional, Safari, About).

import SwiftUI
#if os(macOS)
import SafariServices
#endif

struct SettingsView: View {
    @EnvironmentObject private var model: AppModel
    @Environment(\.dismiss) private var dismiss

    static let extensionId = "dev.sakshipatil.WatchYourBreath.Extension"

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                HStack(spacing: 4) {
                    Button { dismiss() } label: {
                        Glyph(name: "glyph-back", size: 20).foregroundStyle(Palette.inkSoft)
                            .frame(width: 44, height: 44).contentShape(Circle())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Back")
                    .keyboardShortcut(.cancelAction)
                    Text("Settings").font(Typeface.title(22)).foregroundStyle(Palette.ink)
                        .accessibilityAddTraits(.isHeader)
                }
                .padding(.leading, -12).padding(.top, -10)

                RemindersGroup()
                NotificationGroup()
                SoundGroup()
                QuietGroup()
                OptionalGroup()
                SafariGroup()
                AboutGroup()
            }
            .frame(maxWidth: 360)
            .sticker()
            .padding(.horizontal, 16)
            .padding(.vertical, 24)
            .frame(maxWidth: .infinity)
        }
        .scrollBounceBehavior(.basedOnSize)
        #if os(iOS)
        .toolbar(.hidden, for: .navigationBar)
        #endif
        .navigationBarBackButtonHidden()
    }
}

private struct RemindersGroup: View {
    @EnvironmentObject private var model: AppModel
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            GroupTitle(text: "Reminders")
            Toggle("Reminders", isOn: model.binding(\.enabled)).toggleStyle(InkToggleStyle())
            IntervalRows(everyLabel: "Frequency")
        }
    }
}

private struct NotificationGroup: View {
    @EnvironmentObject private var model: AppModel
    @State private var hint: (text: String, error: Bool)?
    @State private var sending = false

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            GroupTitle(text: "Notification")
            VStack(alignment: .leading, spacing: 0) {
                InkRadio(title: "Compact", detail: "The drawing and a short reminder", chosen: model.settings.layout == .compact) {
                    model.update { $0.layout = .compact }
                }
                InkRadio(title: "Expanded", detail: "The drawing, the reminder and a short reflection", chosen: model.settings.layout == .expanded) {
                    model.update { $0.layout = .expanded }
                }
            }
            Hint(text: "Reminders arrive as your system’s notifications. The next one reads:")
            if let r = model.upcoming { NoticePreview(reminder: r, layout: model.settings.layout) }
            HStack(spacing: 12) {
                Button("Send one now") {
                    sending = true
                    Task {
                        let ok = await model.sendOneNow()
                        flash(ok ? "Sent. It arrives in a moment." : "Couldn’t show the reminder. Check that notifications are allowed, then try once more.", error: !ok)
                        try? await Task.sleep(for: .seconds(1.2))
                        sending = false
                    }
                }
                .buttonStyle(SecondaryButtonStyle(small: true))
                .disabled(sending)
                Hint(text: hint?.text ?? "Shows it right away, so you can see how one arrives.", error: hint?.error ?? false)
            }
            if !model.notificationsAllowed { DeniedNote() }
        }
    }

    private func flash(_ text: String, error: Bool) {
        hint = (text, error)
        Task {
            try? await Task.sleep(for: .seconds(error ? 5 : 2.8))
            hint = nil
        }
    }
}

/// How the next reminder will read: its round drawing and its words.
struct NoticePreview: View {
    let reminder: Reminder
    let layout: NotificationLayout

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Drawing(reminder: reminder, variant: .icon).frame(width: 44, height: 44)
            VStack(alignment: .leading, spacing: 1) {
                Text(reminder.title).font(Typeface.label(14)).foregroundStyle(Palette.ink)
                Text(reminder.message(for: layout)).font(Typeface.hint(13)).foregroundStyle(Palette.inkSoft)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 0)
        }
        .padding(10)
        .background(Organic.small.fill(Palette.paper))
        .overlay(Organic.small.strokeBorder(Palette.inkHair, lineWidth: 1))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Next reminder: \(reminder.title) \(reminder.message(for: layout))")
    }
}

private struct SoundGroup: View {
    @EnvironmentObject private var model: AppModel
    @State private var failed = false

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            GroupTitle(text: "Sound")
            Toggle("Reminder sound", isOn: model.binding(\.soundEnabled)).toggleStyle(InkToggleStyle())
            HStack(spacing: 12) {
                Button {
                    failed = !model.playBell() // the preview always plays: it was just asked for
                } label: {
                    HStack(spacing: 6) { Glyph(name: "glyph-play", size: 16); Text("Play bell") }
                }
                .buttonStyle(SecondaryButtonStyle(small: true))
                Hint(text: failed ? "Couldn’t play the bell. Check that your sound is on, then try again." : "A single soft bell. It plays once with each reminder.", error: failed)
            }
        }
    }
}

private struct QuietGroup: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        TimelineView(.everyMinute) { context in
            let quietNow = model.settings.enabled && Schedule.isQuiet(context.date, model.settings)
            VStack(alignment: .leading, spacing: 6) {
                GroupTitle(text: "Quiet hours", quiet: quietNow)
                Hint(text: "No reminders between these times." + (quietNow ? " Quiet now, until \(TimeOfDay.format(Schedule.quietEnd(after: context.date, model.settings)))." : ""))
                HStack(spacing: 24) {
                    TimeLine(label: "Start", hhmm: model.binding(\.quietStart), quiet: quietNow)
                    TimeLine(label: "End", hhmm: model.binding(\.quietEnd), quiet: quietNow)
                    Spacer(minLength: 0)
                }
            }
        }
    }
}

/// A time on a written line; sage beneath while quiet hours are on.
private struct TimeLine: View {
    let label: String
    @Binding var hhmm: String
    let quiet: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label).font(Typeface.hint(12)).foregroundStyle(Palette.inkSoft)
            DatePicker(label, selection: date, displayedComponents: .hourAndMinute)
                .labelsHidden()
                .datePickerStyle(.compact)
                .padding(.bottom, 2)
                .overlay(alignment: .bottom) {
                    Rectangle().fill(quiet ? Palette.sage : Palette.ink).frame(height: quiet ? 2 : 1.5)
                }
        }
    }

    private var date: Binding<Date> {
        Binding {
            let m = TimeOfDay.minutes(hhmm)
            return Calendar.current.date(bySettingHour: m / 60, minute: m % 60, second: 0, of: Date()) ?? Date()
        } set: { d in
            let c = Calendar.current.dateComponents([.hour, .minute], from: d)
            hhmm = String(format: "%02d:%02d", c.hour ?? 0, c.minute ?? 0)
        }
    }
}

private struct OptionalGroup: View {
    @EnvironmentObject private var model: AppModel
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            GroupTitle(text: "Optional")
            Toggle("Randomize reminder timing", isOn: model.binding(\.randomize)).toggleStyle(InkToggleStyle())
            Hint(text: "Lets each reminder drift a little, so it never lands on the same predictable minute.")
        }
    }
}

/// The Safari extension: the same popup in Safari's toolbar, with the same settings as here.
private struct SafariGroup: View {
    #if os(macOS)
    @State private var enabled: Bool?
    #endif

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            GroupTitle(text: "Safari")
            #if os(iOS)
            Hint(text: "Watch Your Breath also sits in Safari, with the same settings as here. To switch it on, open Settings, then Apps, then Safari, then Extensions, and choose Watch Your Breath.")
            #else
            Hint(text: enabled == true
                 ? "The Safari extension is on. Its settings are the same as these."
                 : "Watch Your Breath also sits in Safari’s toolbar, with the same settings as here. Switch it on in Safari’s settings.")
            if enabled != true {
                Button("Open Safari Settings") {
                    SFSafariApplication.showPreferencesForExtension(withIdentifier: SettingsView.extensionId)
                }
                .buttonStyle(SecondaryButtonStyle(small: true))
            }
            #endif
        }
        #if os(macOS)
        .task {
            SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: SettingsView.extensionId) { state, _ in
                let on = state?.isEnabled
                DispatchQueue.main.async { enabled = on }
            }
        }
        #endif
    }
}

private struct AboutGroup: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            GroupTitle(text: "About")
            Text("Watch Your Breath is a small reminder to notice something that is already happening.")
                .font(Typeface.body(14)).foregroundStyle(Palette.ink)
                .fixedSize(horizontal: false, vertical: true)
            Hint(text: "Version \(Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "")")
        }
    }
}
