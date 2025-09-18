import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from 'react-hot-toast';
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8DLLXRJE57"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8DLLXRJE57');
          `}
        </Script>
        
        {/* 百度统计 */}
        <Script id="baidu-analytics" strategy="afterInteractive">
          {`
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?2ce585156b064596497db11bbd4ff3b2";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
          `}
        </Script>
        
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#ffffff',
              },
              style: {
                borderLeft: '4px solid #10B981',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#ffffff',
              },
              style: {
                borderLeft: '4px solid #EF4444',
              },
            },
            loading: {
              iconTheme: {
                primary: '#8B5CF6',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
