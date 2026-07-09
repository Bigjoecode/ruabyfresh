import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ruaby Fresh — Fresh Vibes Only | Launching 14 July 2026",
  description:
    "Handcrafted parfaits & creamy 500ml yoghurt drinks, made fresh daily in Asaba. No artificial preservatives. Launching 14 July 2026 — pre-order now and enjoy 15% off all parfaits. Healthy never tasted this good.",
  keywords: [
    "Ruaby Fresh",
    "yoghurt Asaba",
    "parfait",
    "premium yoghurt Nigeria",
    "yoghurt drink Asaba",
    "healthy dessert",
    "bulk yoghurt orders",
  ],
  openGraph: {
    title: "Ruaby Fresh — Fresh Vibes Only",
    description:
      "Premium yoghurt & parfaits, made fresh daily. Healthy never tasted this good.",
    type: "website",
  },
  icons: { icon: "/ruaby-logo.webp" },
};

export const viewport: Viewport = {
  themeColor: "#1f5e2a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jost.variable}`}>
      <body
        style={
          {
            "--font-display": "var(--font-fraunces)",
            "--font-sans": "var(--font-jost)",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
