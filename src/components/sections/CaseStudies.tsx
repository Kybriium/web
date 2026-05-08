"use client";

import {
  BarChart3,
  Boxes as BoxesIcon,
  Building2,
  CalendarClock,
  Car,
  ClipboardList,
  Database,
  Globe,
  HeartPulse,
  Map as MapIcon,
  Phone,
  Rocket,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
  Workflow,
} from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  ProjectsColumn,
  type ProjectItem,
} from "@/components/ui/testimonials-columns";

// Per CLAUDE.md §15.8 — every entry is concept-labeled until confirmed client
// work is published with permission. No invented client names or metrics.
const projects: ProjectItem[] = [
  {
    text: "A driver-tracking and dispatch system that replaces three spreadsheets and a manual handoff between sales and ops. Role-based dashboards, stock control, and a scheduling board the team actually uses.",
    name: "Delivery operations CRM",
    role: "Logistics · Operations",
    icon: Truck,
  },
  {
    text: "A workflow engine that ingests RingCentral call events, drafts follow-up tasks against Microsoft Graph, and shows ops a single feed of what needs attention today.",
    name: "M365 + RingCentral hub",
    role: "Sales operations",
    icon: Phone,
  },
  {
    text: "An ingestion pipeline that turns four disconnected sources into normalised schemas, a server-rendered admin UI, and exports finance teams already trust.",
    name: "Data reporting platform",
    role: "Multi-site retail",
    icon: BarChart3,
  },
  {
    text: "A marketplace where each tenant gets isolated data, configurable workflows, and white-label branding. Built to hold up under load and stay invisible at the network layer.",
    name: "Multi-tenant marketplace",
    role: "B2B platform",
    icon: Building2,
  },
  {
    text: "A drag-and-drop scheduling UI for a field-services team — assignments, conflict detection, and a calendar export that keeps field staff in sync without a separate app.",
    name: "Scheduling and resource board",
    role: "Field services",
    icon: CalendarClock,
  },
  {
    text: "Candidate pipeline, client accounts, GDPR-compliant data lifecycle, and Outlook calendar integration so consultants stop double-booking.",
    name: "Recruitment CRM",
    role: "Recruitment",
    icon: Users,
  },
  {
    text: "A drag-and-drop form builder for an intake team handling sensitive submissions. Audit trail, conditional logic, and exports that match clinical record formats.",
    name: "Forms and intake builder",
    role: "Healthcare-adjacent",
    icon: ClipboardList,
  },
  {
    text: "Real-time stock counts across warehouses, transfer workflows, low-stock alerts, and a barcode-scanning mobile flow for floor staff.",
    name: "Multi-location stock control",
    role: "Distribution",
    icon: BoxesIcon,
  },
  {
    text: "A clinician-facing dashboard with role-based access, audit logging, and exports formatted for digital health standards. Concept reference for a regulated build.",
    name: "Clinical dashboard",
    role: "Healthcare (advisory)",
    icon: HeartPulse,
  },
  {
    text: "A fast, server-rendered marketing site editable by a non-technical team, hooked into a contact pipeline that filters and routes leads to sales.",
    name: "Marketing site + CMS",
    role: "SME services",
    icon: Globe,
  },
  {
    text: "A dispatcher interface for a small fleet — vehicles, drivers, jobs, and fuel cards, all in one screen, with API integrations to the existing telematics provider.",
    name: "Fleet operator admin",
    role: "Transport",
    icon: Car,
  },
  {
    text: "A shared inbox where AI drafts replies based on past tickets and product docs. Humans approve before send. Logs everything for auditing.",
    name: "AI-assisted support inbox",
    role: "SaaS support",
    icon: Sparkles,
  },
  {
    text: "A live driver tracker with route optimisation, customer ETA notifications, and proof-of-delivery photos. Built for a small delivery company.",
    name: "Driver tracking",
    role: "Logistics",
    icon: MapIcon,
  },
  {
    text: "A diagnostic-first rebuild of an existing marketing site — Lighthouse 95+, Core Web Vitals green, structured data added, and clean URLs that rank for buyer queries.",
    name: "SEO-led site rebuild",
    role: "Existing site overhaul",
    icon: Search,
  },
  {
    text: "Cross-system automation that pulls deals from a CRM, drafts emails based on stage, and posts updates to Slack. Reliable, auditable, and easy to extend.",
    name: "CRM-to-email automation",
    role: "Sales operations",
    icon: Workflow,
  },
  {
    text: "A pipeline that ingests CSV exports from four ERPs, normalises into Postgres, and serves a server-rendered reporting UI used by the Monday-morning leadership meeting.",
    name: "Data ingestion + reporting",
    role: "Data ops",
    icon: Database,
  },
  {
    text: "A Next.js storefront on top of a headless commerce backend. Fast product pages, structured data, and a checkout flow that actually converts on mobile.",
    name: "Headless e-commerce",
    role: "Retail",
    icon: ShoppingBag,
  },
  {
    text: "Self-serve onboarding with multi-step setup, sample data seeding, and a team-invite flow. Reduces the average time-to-first-value for new sign-ups.",
    name: "B2B onboarding flow",
    role: "SaaS · Sales ops",
    icon: Rocket,
  },
];

const firstColumn = projects.slice(0, 6);
const secondColumn = projects.slice(6, 12);
const thirdColumn = projects.slice(12, 18);

export function CaseStudies() {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32"
    >
      <SectionHeading
        id="case-studies"
        eyebrow="A look at what we build"
        title="Concepts from our practice."
        intro="Eighteen project archetypes drawn from the kind of engagements we take on day-to-day. Concept-labeled until specific client work is published with permission."
      />

      <div className="mt-14 flex max-h-[720px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
        <ProjectsColumn projects={firstColumn} duration={28} />
        <ProjectsColumn
          projects={secondColumn}
          className="hidden md:block"
          duration={36}
        />
        <ProjectsColumn
          projects={thirdColumn}
          className="hidden lg:block"
          duration={32}
        />
      </div>
    </section>
  );
}
