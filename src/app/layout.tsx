import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1E1B4B" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
