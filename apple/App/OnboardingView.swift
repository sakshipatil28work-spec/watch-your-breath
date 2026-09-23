// First run: the extension's onboarding page, as the app's first screen.
// Choose how often, how it reads, whether the bell rings; then the system asks
// once about notifications, and the reminders begin.

import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject private var model: AppModel
    @State private var interval: IntervalChoice = .minutes(60)
    @State private var customMinutes = 45
    @State private var layout: NotificationLayout = .compact
    @State private var sound = true
    @State private var starting = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                Emblem(enabled: true)
                Text("A small reminder to notice the breath that’s already happening.")
                    .font(Typeface.body(17)).foregroundStyle(Palette.ink)
                    .fixedSize(horizontal: false, vertical: true)

                VStack(alignment: .leading, spacing: 0) {
                    LineMenu(label: "Reminder frequency", selection: $interval, options: [
                        .minutes(30): "Every 30 minutes", .minutes(60): "Every 1 hour",
                        .minutes(120): "Every 2 hours", .custom: "Custom",
                    ], stacked: true)
                    if interval == .custom {
                        LineNumberField(label: "Every", value: $customMinutes, range: Settings.customRange, suffix: "minutes")
                        Hint(text: "Between 5 minutes and 12 hours.")
                    }
                }

                VStack(alignment: .leading, spacing: 0) {
                    Text("Notification style").font(Typeface.label(15)).foregroundStyle(Palette.ink)
                    HStack(spacing: 20) {
                        InkRadio(title: "Compact", chosen: layout == .compact) { layout = .compact }.fixedSize()
                        InkRadio(title: "Expanded", chosen: layout == .expanded) { layout = .expanded }.fixedSize()
                    }
                    Hint(text: "Expanded adds a short reflection to each reminder.")
                }

                VStack(alignment: .leading, spacing: 0) {
                    Text("Reminder sound").font(Typeface.label(15)).foregroundStyle(Palette.ink)
                    HStack(spacing: 20) {
                        InkRadio(title: "On", chosen: sound) { sound = true }.fixedSize()
                        InkRadio(title: "Off", chosen: !sound) { sound = false }.fixedSize()
                    }
                }

                Button("Start reminders") {
                    starting = true
                    Task {
                        await model.start(interval: interval, customMinutes: customMinutes, layout: layout, sound: sound)
                        starting = false
                    }
                }
                .buttonStyle(PrimaryButtonStyle())
                .disabled(starting)
                Hint(text: "Your device will ask once whether Watch Your Breath may send notifications. Reminders need them.")
            }
            .frame(maxWidth: 380)
            .sticker(padding: EdgeInsets(top: 32, leading: 28, bottom: 28, trailing: 28))
            .padding(.horizontal, 16)
            .padding(.vertical, 32)
            .frame(maxWidth: .infinity)
        }
        .scrollBounceBehavior(.basedOnSize)
    }
}
