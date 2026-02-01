import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MeetVerse AI - #1 AI-Powered Video Conferencing Platform",
  description:
    "Transform your meetings with MeetVerse AI. Real-time transcription, AI summaries, smart action items, and 4K video conferencing. Trusted by 50,000+ teams at Google, Stripe & Shopify. Start free today.",
  keywords: [
    "AI video conferencing",
    "meeting transcription",
    "AI meeting assistant",
    "video meetings",
    "meeting summaries",
    "action item tracking",
    "team collaboration",
    "remote meetings",
    "online meetings",
    "video calls",
    "meeting notes AI",
    "transcription software",
  ],
  openGraph: {
    title: "MeetVerse AI - #1 AI-Powered Video Conferencing Platform",
    description:
      "Transform your meetings with real-time AI transcription, instant summaries, and smart action items. Trusted by 50,000+ teams worldwide.",
    type: "website",
    url: "https://meetverse.ai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MeetVerse AI - Intelligent Meeting Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MeetVerse AI - #1 AI-Powered Video Conferencing",
    description:
      "AI transcription, instant summaries, smart action items. Save 5+ hours every week. Start free.",
  },
  alternates: {
    canonical: "https://meetverse.ai",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "MeetVerse AI",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "AI-powered video conferencing platform with real-time transcription, meeting summaries, and action item detection.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free plan available",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "2847",
              bestRating: "5",
            },
            featureList: [
              "Real-time AI transcription",
              "Meeting summaries",
              "Action item detection",
              "4K video conferencing",
              "100+ language support",
              "Calendar integrations",
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
