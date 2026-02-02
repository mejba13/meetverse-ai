import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

// ============================================
// TRENDING TYPOGRAPHY SYSTEM 2024-2025
// ============================================

// Display Font: Space Grotesk - Sharp, geometric, tech-forward
// Trending for SaaS, AI products, and modern tech brands
// Similar vibe to Clash Display / Cabinet Grotesk
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

// Body Font: DM Sans - Clean, modern, excellent readability
// Trending alternative to Satoshi/General Sans
// Perfect balance of geometric and humanist qualities
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

// Mono Font: Fira Code - Modern, ligature-enabled monospace
const firaCode = Fira_Code({
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
          ${spaceGrotesk.variable}
          ${dmSans.variable}
          ${firaCode.variable}
          font-sans antialiased
        `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
