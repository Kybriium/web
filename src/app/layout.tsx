import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { ScrollPath } from "@/components/ScrollPath";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const titleDefault = `${site.name} — Web Platforms & Automation for UK Businesses`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: titleDefault, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: site.name,
    title: titleDefault,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description: site.description,
  },
  robots: { index: true, follow: true },
  applicationName: site.name,
  authors: [{ name: site.legalName }],
};

export const viewport: Viewport = {
  themeColor: "#18454a",
  colorScheme: "light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressCountry: site.countryCode,
    addressRegion: site.region,
  },
  identifier: {
    "@type": "PropertyValue",
    propertyID: "UK Companies House registration number",
    value: site.companyNumber,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={geist.variable}>
      <body className="flex min-h-dvh flex-col">
        {/* Reveal-tagged elements are hidden by default in globals.css so the
            GSAP timeline can animate them in. For users with JS disabled, this
            <noscript> block reverses that so content stays readable. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-reveal],[data-hero-stage],[data-reveal-stagger]>*{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
        <ScrollAnimations />
        <ScrollPath />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
