import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.petemojimaker.com'),
  title: "Pet Emoji Generator - Transform Your Pet Into Amazing Emojis",
  description: "Create AI-generated pet emojis from your pet photos. Free, fast, and fun! Upload your pet photo and get cute emoji versions instantly.",
  keywords: "pet emoji, AI pet generator, pet meme, cute pet emoji, pet photo to emoji",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://www.petemojimaker.com',
  },
  openGraph: {
    title: "Pet Emoji Generator - AI Pet Emoji Maker",
    description: "Transform your pet photos into adorable emojis with AI",
    images: ["/og-image.jpg"],
    url: 'https://www.petemojimaker.com',
    siteName: 'Pet Emoji Generator',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Emoji Generator",
    description: "Transform your pet photos into adorable emojis with AI",
    images: ["/og-image.jpg"],
  },
  other: {
    "msvalidate.01": "07DF65238CA0CE3FBA47F0F2190B65E8",
    "google-site-verification": "mZtGqVoq9AKOtXfhea_eVIjt0IBd5yfviTeo_PWMKv8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
