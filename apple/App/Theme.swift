// The design system of DESIGN.md, in SwiftUI: one ink on warm sand, burnt
// clay for the one thing that asks, ochre for the bell, clay for the desk,
// sage for quiet hours only. Eczar speaks, Mukta operates, Cormorant italic
// is the supporting line. Every corner organic.

import CoreText
import SwiftUI

enum Palette {
    static let cream = Color(hex: 0xF3E8D2)
    static let paper = Color(hex: 0xF9F2E4)
    static let ink = Color(hex: 0x243C3A)
    static let inkSoft = ink.opacity(0.72)
    static let inkFaint = ink.opacity(0.34)
    static let inkHair = ink.opacity(0.18)
    static let inkShade = ink.opacity(0.14)
    static let rust = Color(hex: 0xA85F43)
    static let rustDeep = Color(hex: 0x8C4D36)
    static let rustDeeper = Color(hex: 0x7A4230)
    static let ochre = Color(hex: 0xC0954A)
    static let clay = Color(hex: 0xE4C4A6)
    static let clayWash = rust.opacity(0.18)
    static let sage = Color(hex: 0x87947A)
}

extension Color {
    init(hex: UInt32) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255
        )
    }
}

/// The three voices. Sizes follow the popup; each scales with Dynamic Type.
enum Typeface {
    static func phrase(_ size: CGFloat = 27) -> Font { .custom("Eczar-Bold", size: size, relativeTo: .title) }
    static func title(_ size: CGFloat = 17) -> Font { .custom("Eczar-SemiBold", size: size, relativeTo: .headline) }
    static func cardTitle(_ size: CGFloat = 21) -> Font { .custom("Eczar-Bold", size: size, relativeTo: .title3) }
    static func script(_ size: CGFloat = 17) -> Font {
        .custom("CormorantGaramondLight-SemiBoldItalic", size: size, relativeTo: .body)
    }
    static func body(_ size: CGFloat = 15) -> Font { .custom("Mukta-Regular", size: size, relativeTo: .body) }
    static func label(_ size: CGFloat = 15) -> Font { .custom("Mukta-Medium", size: size, relativeTo: .body) }
    static func hint(_ size: CGFloat = 13) -> Font { .custom("Mukta-Regular", size: size, relativeTo: .footnote) }

    /// The fonts ship in the bundle's Fonts folder (converted from the extension's own).
    static func register() {
        let urls = Bundle.main.urls(forResourcesWithExtension: "ttf", subdirectory: "Fonts") ?? []
        for url in urls { CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil) }
    }
}

/// The nine-second breath every drawing moves on.
enum Breath {
    static let period: Double = 9
    static let curve = Animation.timingCurve(0.45, 0, 0.55, 1, duration: period / 2)
    static let settle = Animation.timingCurve(0.2, 0.8, 0.3, 1, duration: 0.26)
}

// MARK: organic corners

/// A rectangle whose four corners are elliptical and all different, like the
/// CSS eight-value border-radius in DESIGN.md. Radii go top-left, top-right,
/// bottom-right, bottom-left, each as (horizontal, vertical); `relative`
/// reads them as fractions of the size, like percentages.
struct Organic: InsettableShape {
    var radii: [CGSize]
    var relative = false
    var insetAmount: CGFloat = 0

    static let sticker = Organic(radii: [.init(width: 18, height: 22), .init(width: 22, height: 16), .init(width: 16, height: 24), .init(width: 24, height: 18)])
    static let card = Organic(radii: [.init(width: 16, height: 20), .init(width: 20, height: 14), .init(width: 14, height: 22), .init(width: 22, height: 16)])
    static let small = Organic(radii: [.init(width: 9, height: 11), .init(width: 11, height: 8), .init(width: 8, height: 12), .init(width: 12, height: 9)])
    static let pill = Organic(radii: [.init(width: 14, height: 15), .init(width: 16, height: 13), .init(width: 13, height: 16), .init(width: 15, height: 14)])
    static let circle = Organic(radii: [.init(width: 0.52, height: 0.50), .init(width: 0.48, height: 0.50), .init(width: 0.50, height: 0.48), .init(width: 0.50, height: 0.52)], relative: true)
    static let knob = Organic(radii: [.init(width: 0.62, height: 0.45), .init(width: 0.38, height: 0.55), .init(width: 0.55, height: 0.40), .init(width: 0.45, height: 0.60)], relative: true)
    static let mark = Organic(radii: [.init(width: 0.55, height: 0.48), .init(width: 0.45, height: 0.52), .init(width: 0.50, height: 0.48), .init(width: 0.50, height: 0.52)], relative: true)

    func path(in frame: CGRect) -> Path {
        let r = frame.insetBy(dx: insetAmount, dy: insetAmount)
        var c = radii.map { relative ? CGSize(width: $0.width * r.width, height: $0.height * r.height) : $0 }
        // as CSS does: if two radii on a side add up past its length, scale them all down
        let sides = [
            r.width / max(c[0].width + c[1].width, 0.001),
            r.height / max(c[1].height + c[2].height, 0.001),
            r.width / max(c[2].width + c[3].width, 0.001),
            r.height / max(c[3].height + c[0].height, 0.001),
        ]
        let f = min(1, sides.min() ?? 1)
        c = c.map { CGSize(width: $0.width * f, height: $0.height * f) }
        let k: CGFloat = 1 - 0.5523 // cubic approximation of a quarter ellipse
        let (tl, tr, br, bl) = (c[0], c[1], c[2], c[3])

        var p = Path()
        p.move(to: CGPoint(x: r.minX + tl.width, y: r.minY))
        p.addLine(to: CGPoint(x: r.maxX - tr.width, y: r.minY))
        p.addCurve(to: CGPoint(x: r.maxX, y: r.minY + tr.height),
                   control1: CGPoint(x: r.maxX - tr.width * k, y: r.minY),
                   control2: CGPoint(x: r.maxX, y: r.minY + tr.height * k))
        p.addLine(to: CGPoint(x: r.maxX, y: r.maxY - br.height))
        p.addCurve(to: CGPoint(x: r.maxX - br.width, y: r.maxY),
                   control1: CGPoint(x: r.maxX, y: r.maxY - br.height * k),
                   control2: CGPoint(x: r.maxX - br.width * k, y: r.maxY))
        p.addLine(to: CGPoint(x: r.minX + bl.width, y: r.maxY))
        p.addCurve(to: CGPoint(x: r.minX, y: r.maxY - bl.height),
                   control1: CGPoint(x: r.minX + bl.width * k, y: r.maxY),
                   control2: CGPoint(x: r.minX, y: r.maxY - bl.height * k))
        p.addLine(to: CGPoint(x: r.minX, y: r.minY + tl.height))
        p.addCurve(to: CGPoint(x: r.minX + tl.width, y: r.minY),
                   control1: CGPoint(x: r.minX, y: r.minY + tl.height * k),
                   control2: CGPoint(x: r.minX + tl.width * k, y: r.minY))
        p.closeSubpath()
        return p
    }

    func inset(by amount: CGFloat) -> Organic {
        var s = self
        s.insetAmount += amount
        return s
    }
}

// MARK: surfaces

extension View {
    /// The sticker: sand, a 1.5px ink edge, the 4px paper die-cut edge and, when
    /// `lift`, the one soft drop in the world.
    func sticker(_ shape: Organic = .sticker, lift: Bool = true, padding: EdgeInsets = EdgeInsets(top: 22, leading: 22, bottom: 20, trailing: 22)) -> some View {
        self
            .padding(padding)
            .background(shape.fill(Palette.cream))
            .overlay(shape.strokeBorder(Palette.ink, lineWidth: 1.5))
            .background(
                shape.inset(by: -4).fill(Palette.paper)
                    .shadow(color: lift ? Palette.inkShade : .clear, radius: 5, y: 3)
            )
    }
}
