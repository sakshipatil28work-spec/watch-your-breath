// The controls, drawn in ink rather than boxed: a pill switch whose knob is
// the drawn ring, a written line under a value, a radio whose mark is the
// ring, burnt-clay stamps for the one action. See DESIGN.md › Components.

import SwiftUI

#if canImport(UIKit)
import UIKit
typealias PlatformImage = UIImage
#else
import AppKit
typealias PlatformImage = NSImage
#endif

/// A hand-drawn UI glyph from the asset catalog, in the current colour.
struct Glyph: View {
    let name: String
    var size: CGFloat = 20
    var body: some View {
        Image(name).renderingMode(.template).resizable().scaledToFit()
            .frame(width: size, height: size)
            .accessibilityHidden(true)
    }
}

/// A reminder's drawing, from the bundle (they are not in the asset catalog,
/// because the notifications need them as files).
struct Drawing: View {
    let reminder: Reminder
    var variant: ReminderLibrary.Variant = .card

    var body: some View {
        if let url = ReminderLibrary.imageURL(reminder, variant), let image = PlatformImage(contentsOfFile: url.path) {
            #if canImport(UIKit)
            Image(uiImage: image).resizable().scaledToFit()
            #else
            Image(nsImage: image).resizable().scaledToFit()
            #endif
        } else {
            Color.clear
        }
    }
}

/// Moves a drawing on the nine-second clock, the way its reminder names.
struct BreathingModifier: ViewModifier {
    let motion: Reminder.Motion
    var active = true
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var inhale = false

    func body(content: Content) -> some View {
        let on = inhale && active && !reduceMotion
        return content
            .scaleEffect(x: on ? scale.x : 1, y: on ? scale.y : 1, anchor: UnitPoint(x: 0.5, y: 0.55))
            .offset(x: on ? shift.width : 0, y: on ? shift.height : 0)
            .rotationEffect(.degrees(on && motion == .drift ? -1.2 : 0))
            .onAppear {
                guard !reduceMotion else { return }
                withAnimation(Breath.curve.repeatForever(autoreverses: true)) { inhale = true }
            }
    }

    private var scale: (x: CGFloat, y: CGFloat) {
        switch motion {
        case .flow: return (1.02, 1)
        case .ripple: return (1.03, 1.03)
        case .drift: return (1, 1)
        case .breathe: return (1.025, 1.025)
        }
    }

    private var shift: CGSize {
        switch motion {
        case .flow: return CGSize(width: 2.5, height: 0)
        case .drift: return CGSize(width: 2, height: -2)
        default: return .zero
        }
    }
}

extension View {
    func breathing(_ motion: Reminder.Motion, active: Bool = true) -> some View {
        modifier(BreathingModifier(motion: motion, active: active))
    }
}

// MARK: toggle

/// The pill switch: a 42 × 24 ink track; the knob is the drawn ring, and on,
/// it slides, turns a little and fills with rust. The word sits beside it so
/// the state is never colour alone.
struct InkToggleStyle: ToggleStyle {
    /// The sound variant: the bell before the track, ochre when on.
    var bell = false

    func makeBody(configuration: Configuration) -> some View {
        Button {
            withAnimation(Breath.settle) { configuration.isOn.toggle() }
        } label: {
            HStack(spacing: 8) {
                configuration.label
                    .font(Typeface.label(15))
                    .foregroundStyle(Palette.ink)
                Spacer(minLength: 12)
                if bell {
                    Glyph(name: "glyph-bell", size: 18)
                        .foregroundStyle(configuration.isOn ? Palette.ochre : Palette.inkFaint)
                }
                ZStack(alignment: .leading) {
                    Organic.pill.fill(configuration.isOn ? Palette.clayWash : .clear)
                    Organic.pill.strokeBorder(Palette.ink, lineWidth: 1.5)
                    knob(on: configuration.isOn)
                        .padding(.leading, 3.5)
                        .offset(x: configuration.isOn ? 18 : 0)
                }
                .frame(width: 42, height: 24)
                Text(configuration.isOn ? "On" : "Off")
                    .font(Typeface.label(14))
                    .foregroundStyle(configuration.isOn ? Palette.ink : Palette.inkSoft)
                    .frame(minWidth: 26, alignment: .leading)
            }
            .frame(minHeight: 44)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityRepresentation { Toggle(isOn: configuration.$isOn) { configuration.label } }
    }

    @ViewBuilder private func knob(on: Bool) -> some View {
        ZStack {
            if on {
                Organic.knob.fill(Palette.rust)
            } else {
                Image("ring").resizable().scaledToFit()
            }
        }
        .frame(width: 17, height: 17)
        .rotationEffect(.degrees(on ? 12 : 0))
    }
}

// MARK: written line

/// A value set on a written line: the choice, the drawn chevron, a 1.5px ink line beneath.
struct LineMenu<Choice: Hashable>: View {
    let label: String
    @Binding var selection: Choice
    /// Each choice and how it reads, in order.
    let options: KeyValuePairs<Choice, String>
    /// The label above the value, for long labels and long values on a narrow screen.
    var stacked = false

    var body: some View {
        let layout = stacked
            ? AnyLayout(VStackLayout(alignment: .leading, spacing: 4))
            : AnyLayout(HStackLayout())
        layout {
            Text(label).font(Typeface.label(15)).foregroundStyle(Palette.ink)
            if !stacked { Spacer(minLength: 12) }
            Menu {
                Picker(label, selection: $selection) {
                    ForEach(options.indices, id: \.self) { i in Text(options[i].value).tag(options[i].key) }
                }
                .pickerStyle(.inline)
            } label: {
                HStack(spacing: 6) {
                    Text(options.first { $0.key == selection }?.value ?? "")
                        .font(Typeface.body(15))
                    Glyph(name: "glyph-chevron", size: 14)
                }
                .foregroundStyle(Palette.ink)
                .padding(.top, 3).padding(.bottom, 2)
                .overlay(alignment: .bottom) { Rectangle().fill(Palette.ink).frame(height: 1.5).offset(y: 1) }
            }
            .menuStyle(.button)
            .buttonStyle(.plain)
            .fixedSize()
        }
        .frame(minHeight: 44)
    }
}

/// A number on a written line, e.g. custom minutes.
struct LineNumberField: View {
    let label: String
    @Binding var value: Int
    let range: ClosedRange<Int>
    let suffix: String
    @State private var text = ""
    @FocusState private var focused: Bool

    var body: some View {
        HStack {
            Text(label).font(Typeface.label(15)).foregroundStyle(Palette.ink)
            Spacer(minLength: 12)
            TextField("", text: $text)
                .font(Typeface.body(15))
                .multilineTextAlignment(.trailing)
                .frame(width: 64)
                .focused($focused)
                #if os(iOS)
                .keyboardType(.numberPad)
                #endif
                .textFieldStyle(.plain)
                .padding(.top, 3).padding(.bottom, 2)
                .overlay(alignment: .bottom) { Rectangle().fill(Palette.ink).frame(height: 1.5).offset(y: 1) }
                .onSubmit(commit)
                .onChange(of: focused) { _, isFocused in if !isFocused { commit() } }
                .accessibilityLabel("\(label), \(suffix)")
            Text(suffix).font(Typeface.body(15)).foregroundStyle(Palette.inkSoft)
        }
        .frame(minHeight: 44)
        .onAppear { text = String(value) }
        .onChange(of: value) { _, v in if !focused { text = String(v) } }
    }

    private func commit() {
        let n = min(range.upperBound, max(range.lowerBound, Int(text.trimmingCharacters(in: .whitespaces)) ?? value))
        text = String(n)
        if n != value { value = n }
    }
}

// MARK: radio

/// The ring as the mark; chosen, a rust blob settles into it.
struct InkRadio: View {
    let title: String
    var detail: String?
    let chosen: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(alignment: .top, spacing: 10) {
                ZStack {
                    Image("ring").resizable().scaledToFit().frame(width: 18, height: 18)
                    Organic.knob.fill(Palette.rust).frame(width: 9, height: 9).scaleEffect(chosen ? 1 : 0.01)
                }
                .padding(.top, 2)
                VStack(alignment: .leading, spacing: 1) {
                    Text(title).font(Typeface.body(15)).foregroundStyle(Palette.ink)
                    if let detail { Text(detail).font(Typeface.hint()).foregroundStyle(Palette.inkSoft) }
                }
                Spacer(minLength: 0)
            }
            .frame(minHeight: 44)
            .contentShape(Rectangle())
            .animation(Breath.settle, value: chosen)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(chosen ? [.isSelected] : [])
    }
}

// MARK: buttons

/// The burnt-clay stamp: the one thing that asks.
struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(Typeface.label(16))
            .foregroundStyle(Palette.cream)
            .padding(.vertical, 12).padding(.horizontal, 20)
            .background(Organic.small.fill(configuration.isPressed ? Palette.rustDeeper : Palette.rustDeep))
            .contentShape(Rectangle())
    }
}

/// Ink outline on sand; pressed, it fills with paper.
struct SecondaryButtonStyle: ButtonStyle {
    var small = false
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(Typeface.label(small ? 14 : 15))
            .foregroundStyle(Palette.ink)
            .padding(.vertical, small ? 6 : 9).padding(.horizontal, small ? 12 : 16)
            .background(Organic.small.fill(configuration.isPressed ? Palette.paper : .clear))
            .overlay(Organic.small.strokeBorder(Palette.ink, lineWidth: 1.5))
            .frame(minHeight: 44) // the hit area, not the drawn outline
            .contentShape(Rectangle())
            .opacity(isEnabled ? 1 : 0.5)
    }
}

// MARK: text

struct GroupTitle: View {
    let text: String
    var quiet = false
    var body: some View {
        HStack(spacing: 8) {
            Text(text).font(Typeface.title(17)).foregroundStyle(Palette.ink)
            if quiet { Organic.mark.fill(Palette.sage).frame(width: 9, height: 9).accessibilityHidden(true) }
        }
        .accessibilityAddTraits(.isHeader)
    }
}

struct Hint: View {
    let text: String
    var error = false
    var body: some View {
        Text(text).font(Typeface.hint()).foregroundStyle(error ? Palette.rustDeep : Palette.inkSoft)
            .fixedSize(horizontal: false, vertical: true)
    }
}
