// Home: the popup's twin. The sticker on the clay desk, the emblem breathing,
// a handful of rows (Reminders, Every, Notification, Sound) and one status line.

import SwiftUI
#if canImport(UIKit)
import UIKit
#else
import AppKit
#endif

struct HomeView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                HStack {
                    Spacer()
                    Button {
                        model.settingsOpen = true
                    } label: {
                        Glyph(name: "glyph-gear", size: 20)
                            .foregroundStyle(Palette.inkSoft)
                            .frame(width: 44, height: 44)
                            .contentShape(Circle())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Settings")
                }
                .padding(.top, -12).padding(.trailing, -12)

                Emblem(enabled: model.settings.enabled, justReminded: model.status().tone == .active)
                    .padding(.bottom, 14)

                VStack(spacing: 0) {
                    Toggle("Reminders", isOn: model.binding(\.enabled))
                        .toggleStyle(InkToggleStyle())
                    IntervalRows(everyLabel: "Every")
                    LineMenu(label: "Notification", selection: model.binding(\.layout), options: [
                        .compact: "Compact", .expanded: "Expanded",
                    ])
                    Toggle("Sound", isOn: model.binding(\.soundEnabled))
                        .toggleStyle(InkToggleStyle(bell: true))
                }

                StatusLine()
                    .padding(.top, 14)

                if !model.notificationsAllowed { DeniedNote().padding(.top, 14) }
            }
            .frame(maxWidth: 360)
            .sticker()
            .padding(.horizontal, 16)
            .padding(.vertical, 24)
            .frame(maxWidth: .infinity)
        }
        .scrollBounceBehavior(.basedOnSize)
        .background(Palette.clay.ignoresSafeArea()) // the navigation stack paints its own white otherwise
        .navigationDestination(isPresented: $model.settingsOpen) { SettingsView() }
        #if os(iOS)
        .toolbar(.hidden, for: .navigationBar)
        #endif
    }
}

/// The frequency picker and, for Custom, the minutes on a written line.
struct IntervalRows: View {
    @EnvironmentObject private var model: AppModel
    let everyLabel: String

    var body: some View {
        LineMenu(label: everyLabel, selection: model.binding(\.interval), options: [
            .minutes(30): "30 minutes", .minutes(60): "1 hour", .minutes(120): "2 hours", .custom: "Custom",
        ])
        if model.settings.interval == .custom {
            VStack(alignment: .trailing, spacing: 2) {
                LineNumberField(label: "Every", value: model.binding(\.customMinutes), range: Settings.customRange, suffix: "minutes")
                Hint(text: "Between 5 minutes and 12 hours.")
            }
        }
    }
}

/// The hand-drawn sticker, breathing. At rest when reminders are off; two
/// rings settle outward once when a reminder has just arrived.
struct Emblem: View {
    let enabled: Bool
    var justReminded = false
    @State private var settle = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        Image("sticker").resizable().scaledToFit()
            .breathing(.breathe, active: enabled)
            .opacity(enabled ? 1 : 0.42)
            .overlay {
                // centred on the drawn ring, which sits at 25 % across, 51 % down
                if justReminded && !reduceMotion {
                    GeometryReader { g in
                        ForEach(0..<2, id: \.self) { i in
                            Circle().stroke(Palette.ink, lineWidth: 1.5)
                                .frame(width: g.size.height * 0.52, height: g.size.height * 0.52)
                                .scaleEffect(settle ? 1.7 : 1)
                                .opacity(settle ? 0 : 0.35)
                                .animation(.easeOut(duration: 3.2).delay(Double(i) * 0.7), value: settle)
                                .position(x: g.size.width * 0.25, y: g.size.height * 0.51)
                        }
                    }
                    .onAppear { settle = true }
                }
            }
            .frame(maxWidth: .infinity)
            .accessibilityElement()
            .accessibilityLabel("Watch your breath. Just a moment.")
            .accessibilityAddTraits(.isHeader)
    }
}

struct StatusLine: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        // refreshes itself each minute so "Just a moment." gives way on time
        TimelineView(.everyMinute) { context in
            let status = model.status(at: context.date)
            HStack(alignment: .firstTextBaseline, spacing: 6) {
                if status.tone == .quiet {
                    Organic.mark.fill(Palette.sage).frame(width: 7, height: 7).accessibilityHidden(true)
                }
                Text(status.text)
                    .font(status.tone == .active ? Typeface.script(17) : Typeface.hint(13))
                    .foregroundStyle(Palette.inkSoft)
                    .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: 0)
            }
            .accessibilityElement(children: .combine)
        }
    }
}

/// Notifications switched off for the app: say so, and where to switch them on.
struct DeniedNote: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Hint(text: "Notifications for Watch Your Breath are switched off, so reminders cannot be shown. To allow them, open Settings, then Notifications, and switch Watch Your Breath on.")
            #if os(iOS)
            Button("Open Settings") {
                if let url = URL(string: UIApplication.openNotificationSettingsURLString) { UIApplication.shared.open(url) }
            }
            .buttonStyle(SecondaryButtonStyle(small: true))
            #else
            Button("Open System Settings") {
                if let url = URL(string: "x-apple.systempreferences:com.apple.Notifications-Settings.extension") {
                    NSWorkspace.shared.open(url)
                }
            }
            .buttonStyle(SecondaryButtonStyle(small: true))
            #endif
        }
        .padding(.vertical, 10).padding(.horizontal, 12)
        .overlay(Organic.small.strokeBorder(Palette.inkHair, lineWidth: 1))
    }
}
