import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const title = "Muhammad Zubair | AI Engineer & Web Developer";
const description =
  "Muhammad Zubair is an AI Engineer and Web Developer specializing in modern web development, WordPress, Shopify, AI solutions, automation, and AI-assisted development.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.links.linkedin }],
  creator: profile.name,
  keywords: [
    "Muhammad Zubair",
    "AI Engineer",
    "Web Developer",
    "WordPress Developer",
    "Shopify Developer",
    "AI Automation",
    "Karachi",
    "Pakistan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title,
    description,
    locale: "en_US",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Muhammad Zubair, AI Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#06070b",
  colorScheme: "dark",
};

/** Plays the intro once per browser session; later visits skip straight to content. */
const introScript = `try{var k='mz-intro';if(sessionStorage.getItem(k)){document.documentElement.dataset.intro='seen'}else{sessionStorage.setItem(k,'1')}}catch(e){}`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
  alumniOf: "Dawood University of Engineering and Technology",
  sameAs: [profile.links.github, profile.links.linkedin],
  url: siteUrl,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
