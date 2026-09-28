import type { Metadata, Viewport } from "next";
import { Eczar, Mukta } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const eczar = Eczar({
  subsets: ["latin"],
  // 500 carries the quiet accent lines ("Just a moment."): Eczar has no true
  // italic, and a browser-slanted one distorts the face, so those lines are
  // upright at a lighter weight instead.
  weight: ["500", "600", "700", "800"],
  variable: "--font-eczar",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mukta",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.tagline,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: SITE.name,
    description: SITE.tagline,
    type: "website",
    images: [{ url: "/illustrations/hero.png", width: 1296, height: 1181, alt: "Watch your breath. Just a moment." }],
  },
  icons: { icon: "/icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#F4EBDD",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${eczar.variable} ${mukta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
