// A reminder, opened from its notification: the reminder card from the
// extension (DESIGN.md › Reminder Card), full size. The drawing breathes in
// its own way; the reflection is there if wanted. Nothing to do but close it.

import SwiftUI

struct ReminderView: View {
    let reminder: Reminder
    @Environment(\.dismiss) private var dismiss
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var arrived = false

    var body: some View {
        ZStack {
            Palette.clay.ignoresSafeArea()
            VStack(spacing: 18) {
                ZStack {
                    Organic.circle.fill(Palette.paper)
                    Drawing(reminder: reminder).padding(22)
                        .breathing(reminder.motion)
                        .accessibilityLabel(reminder.alt)
                }
                .frame(width: 220, height: 220)

                VStack(spacing: 4) {
                    Text(reminder.title).font(Typeface.cardTitle(26)).foregroundStyle(Palette.ink)
                        .multilineTextAlignment(.center)
                        .accessibilityAddTraits(.isHeader)
                    Text(reminder.supporting).font(Typeface.script(20)).foregroundStyle(Palette.inkSoft)
                }

                if let reflection = reminder.reflection {
                    Rectangle().fill(Palette.inkHair).frame(width: 120, height: 1)
                    Text(reflection).font(Typeface.body(15)).foregroundStyle(Palette.ink)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: 280)
                        .fixedSize(horizontal: false, vertical: true)
                }

                Button("Close") { dismiss() }
                    .buttonStyle(SecondaryButtonStyle(small: true))
                    .keyboardShortcut(.cancelAction)
            }
            .padding(.vertical, 8)
            .frame(maxWidth: 340)
            .sticker(.card, lift: false, padding: EdgeInsets(top: 28, leading: 24, bottom: 20, trailing: 24))
            .padding(16)
            .opacity(arrived || reduceMotion ? 1 : 0)
            .offset(y: arrived || reduceMotion ? 0 : 6)
            .onAppear { withAnimation(.timingCurve(0.2, 0.8, 0.3, 1, duration: 0.52)) { arrived = true } }
        }
        .presentationBackground(Palette.clay)
    }
}
