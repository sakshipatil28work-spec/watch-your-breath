import type { Metadata, Viewport } from "next";
import { Eczar, Mukta, Cormorant_Garamond } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const eczar = Eczar({
  subsets: ["latin"],
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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
  variable: "--font-cormorant",
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
    <html lang="en" className={`${eczar.variable} ${mukta.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
