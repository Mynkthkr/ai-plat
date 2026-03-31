import type { Metadata } from "next";
import EasterEggs from "@/components/EasterEggs";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Pulse — Your Daily AI News Feed",
  description:
    "Auto-curated AI news, rewritten by AI, delivered fresh every 24 hours. Zero noise, pure signal. Powered by RSS, Gemini, and Supabase.",
  keywords: [
    "AI news",
    "artificial intelligence",
    "AI tools",
    "machine learning",
    "ChatGPT",
    "Gemini",
    "AI trends",
    "daily AI newsletter",
  ],
  authors: [{ name: "AI Pulse" }],
  openGraph: {
    title: "AI Pulse — Your Daily AI News Feed",
    description:
      "Auto-curated AI news, rewritten by AI, delivered fresh every 24 hours.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Pulse — Your Daily AI News Feed",
    description:
      "Auto-curated AI news, rewritten by AI, delivered daily.",
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
      </head>
      <body className="antialiased">
        {children}
        <EasterEggs />
      </body>
    </html>
  );
}
