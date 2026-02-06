import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MeetVerse AI - #1 AI-Powered Video Conferencing Platform | Smart Meetings",
  description:
    "Transform your meetings with MeetVerse AI. Real-time transcription in 100+ languages, AI summaries, smart action items, engagement analytics, and 4K video conferencing. Trusted by 50,000+ teams at Google, Stripe & Shopify. Start free today — no credit card required.",
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
    "meeting analytics",
    "AI meeting copilot",
    "smart meeting platform",
    "meeting engagement analytics",
    "real-time captions",
    "meeting recording",
  ],
  openGraph: {
    title: "MeetVerse AI - #1 AI-Powered Video Conferencing Platform",
    description:
      "Transform your meetings with real-time AI transcription, instant summaries, smart action items, and engagement analytics. Trusted by 50,000+ teams worldwide. Start free today.",
    type: "website",
    url: "https://meetverse.ai",
    siteName: "MeetVerse AI",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MeetVerse AI - Intelligent Meeting Platform with AI Copilot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MeetVerse AI - #1 AI-Powered Video Conferencing",
    description:
      "AI transcription, instant summaries, smart action items, engagement analytics. Save 5+ hours every week. Start free — no credit card required.",
    creator: "@meetverseai",
  },
  alternates: {
    canonical: "https://meetverse.ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
            url: "https://meetverse.ai",
            description:
              "AI-powered video conferencing platform with real-time transcription, meeting summaries, action item detection, and engagement analytics. Trusted by 50,000+ teams worldwide.",
            offers: [
              {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free plan — 5 meetings/month, up to 4 participants",
              },
              {
                "@type": "Offer",
                price: "12",
                priceCurrency: "USD",
                description: "Pro plan — Unlimited meetings, 50 participants, AI summaries",
              },
              {
                "@type": "Offer",
                price: "29",
                priceCurrency: "USD",
                description: "Business plan — 200 participants, custom integrations, SSO",
              },
            ],
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
              "Engagement analytics",
              "AI meeting copilot",
              "Cloud recording",
              "Custom branding",
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
