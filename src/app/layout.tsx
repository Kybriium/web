import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { AttributionTracker } from "@/components/AttributionTracker";
import { ContactModalProvider } from "@/components/ContactModal";
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
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.email,
  logo: `${site.url}/logo.png`,
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

const servicesSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Web platforms and websites",
      description:
        "Marketing sites, landing pages, marketplaces, multi-tenant web apps, custom dashboards and admin interfaces — built end-to-end for UK small and mid-sized businesses.",
      provider: { "@id": `${site.url}/#organization` },
      areaServed: { "@type": "Country", name: site.country },
      serviceType: "Web platform development",
    },
    {
      "@type": "Service",
      name: "Internal tools and automation",
      description:
        "Custom CRMs, stock control, scheduling, dashboards, form builders, and workflow automation across Microsoft 365, RingCentral, and existing CRMs for UK businesses.",
      provider: { "@id": `${site.url}/#organization` },
      areaServed: { "@type": "Country", name: site.country },
      serviceType: "Internal tools and workflow automation",
    },
    {
      "@type": "Service",
      name: "Database-heavy applications",
      description:
        "Systems where data integrity, reporting, and scale matter — built with healthcare-grade habits for UK small and mid-sized businesses.",
      provider: { "@id": `${site.url}/#organization` },
      areaServed: { "@type": "Country", name: site.country },
      serviceType: "Custom database applications",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="en-GB" className={geist.variable} suppressHydrationWarning>
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
        <AttributionTracker />
        <ScrollAnimations />
        <ScrollPath />
        <ContactModalProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </ContactModalProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(servicesSchema),
          }}
        />
        {umamiWebsiteId ? (
          <Script
            id="umami"
            src="/stats/script.js"
            data-website-id={umamiWebsiteId}
            data-host-url="/stats"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
