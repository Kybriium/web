import { z } from "zod";

export const projectTypes = [
  "marketing-site",
  "web-platform",
  "internal-tool",
  "automation",
  "database-app",
  "mobile-advisory",
  "hosting-maintenance",
  "seo",
  "not-sure",
] as const;

export const budgetRanges = [
  "under-1k",
  "1k-5k",
  "5k-20k",
  "20k-50k",
  "50k-plus",
  "not-sure",
] as const;

export const dataSensitivityLevels = [
  "general",
  "financial",
  "health",
  "pii",
  "unknown",
] as const;

export const timelineOptions = [
  "asap",
  "within-month",
  "1-3-months",
  "3-6-months",
  "flexible",
] as const;

export const companySizeOptions = [
  "solo",
  "2-10",
  "11-50",
  "51-200",
  "200-plus",
] as const;

export type ProjectType = (typeof projectTypes)[number];
export type BudgetRange = (typeof budgetRanges)[number];
export type DataSensitivity = (typeof dataSensitivityLevels)[number];
export type TimelineOption = (typeof timelineOptions)[number];
export type CompanySize = (typeof companySizeOptions)[number];

export const projectTypeLabels: Record<ProjectType, string> = {
  "marketing-site": "Marketing site / landing page",
  "web-platform": "Web platform (marketplace, social, multi-tenant)",
  "internal-tool": "Internal tool (CRM, stock, scheduling, dashboards)",
  automation: "Workflow automation (connecting existing systems)",
  "database-app": "Database-heavy application",
  "mobile-advisory": "Mobile app (advisory)",
  "hosting-maintenance": "Hosting / maintenance for an existing site or app",
  seo: "SEO for an existing site",
  "not-sure": "Not sure yet",
};

export const budgetLabels: Record<BudgetRange, string> = {
  "under-1k": "Under £1,000",
  "1k-5k": "£1,000 – £5,000",
  "5k-20k": "£5,000 – £20,000",
  "20k-50k": "£20,000 – £50,000",
  "50k-plus": "£50,000+",
  "not-sure": "Not sure yet",
};

export const dataSensitivityLabels: Record<DataSensitivity, string> = {
  general: "General business data",
  financial: "Financial / payments data",
  health: "Health / medical data",
  pii: "Personally identifiable information at scale",
  unknown: "Don't know yet",
};

export const timelineLabels: Record<TimelineOption, string> = {
  asap: "ASAP",
  "within-month": "Within a month",
  "1-3-months": "1–3 months",
  "3-6-months": "3–6 months",
  flexible: "Flexible",
};

export const companySizeLabels: Record<CompanySize, string> = {
  solo: "Solo",
  "2-10": "2–10",
  "11-50": "11–50",
  "51-200": "51–200",
  "200-plus": "200+",
};

const optionalString = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const contactSchema = z.object({
  // required
  name: z.string().trim().min(1, "Required").max(100),
  company: z.string().trim().min(1, "Required").max(150),
  email: z.string().trim().email("Enter a valid email").max(200),
  projectTypes: z
    .array(z.enum(projectTypes))
    .min(1, "Pick at least one"),
  brief: z
    .string()
    .trim()
    .min(50, "Tell us a bit more — at least 50 characters")
    .max(5000),
  budget: z.enum(budgetRanges, { message: "Select a budget range" }),

  // optional
  scale: optionalString(500),
  dataSensitivity: z
    .enum(dataSensitivityLevels)
    .or(z.literal(""))
    .optional(),
  integrations: optionalString(500),
  timeline: z.enum(timelineOptions).or(z.literal("")).optional(),
  companySize: z.enum(companySizeOptions).or(z.literal("")).optional(),
  sector: optionalString(200),
  source: optionalString(200),

  // attribution — auto-captured from utm_* on landing, never user-typed
  utmSource: optionalString(200),
  utmMedium: optionalString(200),
  utmCampaign: optionalString(200),
  utmContent: optionalString(200),
  utmTerm: optionalString(200),

  // hidden — bot trap and challenge token
  honeypot: z.string().max(0, "Bot detected").optional().or(z.literal("")),
  turnstileToken: z.string().optional().or(z.literal("")),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export const contactFormDefaults: ContactPayload = {
  name: "",
  company: "",
  email: "",
  projectTypes: [],
  brief: "",
  budget: "not-sure",
  scale: "",
  dataSensitivity: "",
  integrations: "",
  timeline: "",
  companySize: "",
  sector: "",
  source: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
  honeypot: "",
  turnstileToken: "",
};
