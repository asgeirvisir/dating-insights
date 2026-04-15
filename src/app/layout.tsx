import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PostHogProvider } from "./posthog-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dating Insights — Bold Data on Modern Dating | Smitten",
  description:
    "Data-backed stories about modern dating culture. Powered by Smitten.",
  openGraph: {
    title: "Dating Insights — Bold Data on Modern Dating",
    description:
      "Data-backed stories about modern dating culture. Powered by Smitten.",
    type: "website",
    images: [
      {
        url: "/images/OG.png",
        width: 1200,
        height: 630,
        alt: "The unfiltered truth — Dating behavior & Insights by Smitten",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dating Insights — Bold Data on Modern Dating",
    description:
      "Data-backed stories about modern dating culture. Powered by Smitten.",
    images: ["/images/OG.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Merriweather:wght@400;700;900&family=Outfit:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-base text-content-secondary font-body antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
