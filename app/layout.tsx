import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { MenuBar } from "@/components/os/MenuBar";
import { BootSequence } from "@/components/os/BootSequence";
import { Dock } from "@/components/os/Dock";
import { StatusBar } from "@/components/os/StatusBar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/**
 * Applies a saved theme choice to <html> before hydration so reloading
 * on a light-mode preference never flashes dark first. Mirrors the
 * `sk_os_theme` localStorage key MenuBar reads/writes.
 */
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('sk_os_theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}`;

const BOOT_INIT_SCRIPT = `try{if(!sessionStorage.getItem('sk_os_booted')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-booting','1');setTimeout(function(){document.documentElement.removeAttribute('data-booting');},5000);}}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [
    "Sai Kumar",
    "LLM engineer",
    "Agentic AI",
    "LangGraph",
    "SASTRA",
    "AI portfolio",
  ],
  authors: [{ name: site.name, url: site.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.shortName,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: [site.github, site.linkedin],
  jobTitle: "Engineering Student — LLM & Agentic AI",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "SASTRA Deemed University",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      // THEME_INIT_SCRIPT mutates data-theme before hydration for saved
      // light-theme users; suppress the resulting attribute mismatch.
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: BOOT_INIT_SCRIPT }} />
        <BootSequence />
        <MenuBar />
        {children}
        <StatusBar />
        <Dock />
      </body>
    </html>
  );
}
