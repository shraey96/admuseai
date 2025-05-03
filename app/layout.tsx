import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";
import { getFormattedPrice } from "@/lib/constants";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CreditProvider } from "@/context/CreditContext";

const inter = Inter({ subsets: ["latin"] });

const OG_IMAGE_PATH = "/images/og-desktop.png";
const OG_IMAGE_TWITTER_PATH = OG_IMAGE_PATH;

export const metadata: Metadata = {
  title:
    "AdMuseAI - AI-Powered Creative Generator for Ads, Travel Guides, Menus & More",
  description: `Generate professional-quality ad creatives, travel guides, restaurant menus, magazine covers and more with AI. Upload your content and prompt, get stunning results in seconds. No design skills needed. Just ${getFormattedPrice()} per creative.`,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/admuse.png",
  },
  keywords: [
    "AI ad generator",
    "ad creative generator",
    "AI travel guide generator",
    "AI menu generator",
    "AI magazine cover generator",
    "AI marketing",
    "automated ad creation",
    "digital advertising",
    "AI advertising",
    "ad design tool",
    "marketing creative",
    "product advertising",
    "AI-powered ads",
    "travel guide creator",
    "restaurant menu maker",
    "magazine cover designer",
    "product in environment template",
    "marketing promo template",
    "product with person template",
    "styled product template",
    "service menu template",
    "magazine cover template",
    "discount offer template",
    "testimonial template",
    "announcement template",
  ],
  authors: [{ name: "AdMuseAI" }],
  creator: "AdMuseAI",
  publisher: "AdMuseAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://admuseai.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "AdMuseAI - Generate Professional Creatives Instantly with AI",
    description: `Transform your content into stunning ad creatives, travel guides, menus, magazine covers and more with AI. Professional results in seconds, no design skills needed. Just ${getFormattedPrice()} per creative.`,
    url: "https://admuseai.com",
    siteName: "AdMuseAI",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "AdMuseAI - AI-Powered Creative Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generate Professional Ad Creatives Instantly with AI | AdMuseAI",
    description:
      "Create stunning ad creatives for your products using AI. Upload images, add a prompt, and get professional results in seconds. No design skills needed.",
    images: [OG_IMAGE_TWITTER_PATH],
    creator: "@admuseai",
    site: "@admuseai",
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
  alternates: {
    canonical: "https://admuseai.com",
  },
  // verification: {
  //   google: "your-google-site-verification",
  //   // Add other verification tokens as needed:
  //   // bing: "your-bing-verification",
  //   // yandex: "your-yandex-verification",
  // },
  category: "technology",
};

// Add structured data for products and FAQ
const jsonLd = {
  "@context": "http://schema.org",
  "@type": "Product",
  name: "AdMuseAI Creative Generator",
  image: "https://admuseai.com/images/og-desktop.png",
  description:
    "AI-powered creative generator for ads, travel guides, menus, magazine covers and more.",
  brand: {
    "@type": "Brand",
    name: "AdMuseAI",
  },
  offers: {
    "@type": "Offer",
    url: "https://admuseai.com",
    priceCurrency: "USD",
    price: getFormattedPrice(),
    priceValidUntil: "2025-12-31",
    itemCondition: "http://schema.org/NewCondition",
    availability: "http://schema.org/InStock",
  },
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Available Templates",
      value:
        "Product in Environment, Marketing Promo, Product with Person, Styled Product, Service Menu, Magazine Cover, Discount Offer, Testimonial, Announcement",
    },
  ],
};

const faqJsonLd = {
  "@context": "http://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What can AdMuseAI generate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AdMuseAI can generate professional ad creatives, travel guides, restaurant menus, magazine covers and more. Simply upload your content, add a descriptive prompt, and receive AI-generated results in seconds.",
      },
    },
    {
      "@type": "Question",
      name: "How does AdMuseAI work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AdMuseAI allows you to upload your content, add a descriptive prompt, and receive AI-generated creatives in seconds. No design skills needed.",
      },
    },
    {
      "@type": "Question",
      name: "What templates are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AdMuseAI offers various templates including Product in Environment, Marketing Promo, Product with Person, Styled Product, Service Menu, Magazine Cover, Discount Offer, Testimonial, and Announcement templates. Each template is optimized for specific use cases and marketing needs.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CreditProvider>
            <TooltipProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                {children}
                <Footer />
              </ThemeProvider>
              <Toaster />
            </TooltipProvider>
          </CreditProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
