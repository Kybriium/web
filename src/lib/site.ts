export const site = {
  name: "Kybrium",
  legalName: "Cherya Holdings Limited",
  companyNumber: "17203315",
  registeredOffice: "167-169 Great Portland Street, 5th Floor, London W1W 5PF",
  region: "Cambridgeshire",
  country: "United Kingdom",
  countryCode: "GB" as const,
  email: "contact@kybrium.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kybrium.com",
  description:
    "Kybrium is a UK software studio building web platforms, internal tools, and automation for small businesses. Fixed-price, end-to-end, based in Cambridgeshire.",
  tagline: "Web platforms and automation for UK businesses.",
} as const;
