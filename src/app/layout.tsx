import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

// ============================================
// MODERN TYPOGRAPHY SYSTEM - WEBFLOW STYLE
// Clean, bold, professional sans-serif
// ============================================

// Primary Font: Inter - The industry standard
// Used by GitHub, Figma, Linear, Stripe, and most modern SaaS
// Excellent readability, beautiful at all weights
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Mono Font: JetBrains Mono - Clean developer font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MeetVerse AI - Intelligent Meeting Platform",
    template: "%s | MeetVerse AI",
  },
  description:
    "Next-generation AI-powered video conferencing with intelligent meeting co-pilot, real-time transcription, and smart action items.",
  keywords: [
    "video conferencing",
    "AI meetings",
    "transcription",
    "meeting notes",
    "action items",
    "collaboration",
  ],
  authors: [{ name: "MeetVerse AI" }],
  creator: "MeetVerse AI",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MeetVerse AI",
    title: "MeetVerse AI - Intelligent Meeting Platform",
    description:
      "Next-generation AI-powered video conferencing with intelligent meeting co-pilot.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeetVerse AI - Intelligent Meeting Platform",
    description:
      "Next-generation AI-powered video conferencing with intelligent meeting co-pilot.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#030014" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          ${jetbrainsMono.variable}
          font-sans antialiased
        `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
