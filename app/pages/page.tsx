"use client";

import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";

const pages = [
  {
    title: "Login",
    description: "Universal login screen for all Tally+ applications with branded hero section",
    href: "/pages/login",
    icon: "login",
    tags: ["Authentication", "Forms", "Branding"],
  },
  {
    title: "Dashboard",
    description: "Interactive energy dashboard with charts, tables, KPI cards, and performance metrics",
    href: "/pages/dashboard",
    icon: "dashboard",
    tags: ["Charts", "Tables", "Cards", "Widgets"],
  },
  {
    title: "Tally Small Market",
    description: "Tally+ small market customer account page with detailed account information and event timeline",
    href: "/pages/small-market",
    icon: "store",
    tags: ["Forms", "Tables", "Timeline"],
  },
  {
    title: "Tally Small Market V1.5",
    description: "Small market account page rebuilt with the Glass seamless dark chrome and control panel rail",
    href: "/pages/small-market-v1-5",
    icon: "store",
    tags: ["Glass chrome", "Forms", "Tables", "Control Panel"],
  },
  {
    title: "Tally Large Market",
    description: "Customer account management page with collapsible cards and tabbed navigation",
    href: "/pages/tally-large-market",
    icon: "account_circle",
    tags: ["Tabs", "Cards", "Forms"],
  },
  {
    title: "Tally Large Market V1.5",
    description: "Large market account page rebuilt with the Glass seamless dark chrome and control panel rail",
    href: "/pages/tally-large-market-v1-5",
    icon: "account_circle",
    tags: ["Glass chrome", "Tabs", "Cards", "Control Panel"],
  },
  {
    title: "Forms",
    description: "Form examples demonstrating input fields, validation, and form layouts",
    href: "/pages/forms",
    icon: "edit_note",
    tags: ["Inputs", "Validation", "Layout"],
  },
  {
    title: "Tables",
    description: "AG Grid data table template with sorting, filtering, and TDS styling",
    href: "/pages/tables",
    icon: "table_chart",
    tags: ["AG Grid", "Data Grid", "Tables", "Sorting", "Filtering"],
  },
  {
    title: "Glass Vision",
    description: "Tally Glass Vision call centre interface with customer account panels and real-time data",
    href: "/pages/glass-vision",
    icon: "visibility",
    tags: ["Call Centre", "Glass", "Dashboard"],
  },
  {
    title: "Glass Vision – demo2",
    description: "Copy of Glass Vision for iterating on new designs",
    href: "/pages/glass-vision-demo2",
    icon: "visibility",
    tags: ["Call Centre", "Glass", "Dashboard", "Demo"],
  },
  {
    title: "Glass Vision – Demo Version",
    description: "Working copy of Glass Vision for demo iterations",
    href: "/pages/glass-vision-demo-version",
    icon: "visibility",
    tags: ["Call Centre", "Glass", "Dashboard", "Demo"],
  },
  {
    title: "Glass Vision Demo V2",
    description: "Second working copy of Glass Vision Demo for further demo iterations",
    href: "/pages/glass-vision-demo-v2",
    icon: "visibility",
    tags: ["Call Centre", "Glass", "Dashboard", "Demo"],
  },
  {
    title: "Glass Vision Demo V2.2",
    description: "V2 variant where opening an account goes to a dedicated view with Overview, Account Activity, and Bill Compare",
    href: "/pages/glass-vision-demo-v2-2",
    icon: "visibility",
    tags: ["Call Centre", "Glass", "Dashboard", "Demo"],
  },
  {
    title: "Glass Vision – Large Market",
    description: "Tally Glass Vision interface tailored for Large Market commercial accounts with CIS navigation",
    href: "/pages/glass-vision-lm",
    icon: "visibility",
    tags: ["Large Market", "Glass", "Commercial", "Dashboard"],
  },
  {
    title: "Glass Vision LM 2",
    description: "Operations command centre for Large Market: portfolio overview, customer hierarchy, and exception workspace",
    href: "/pages/glass-vision-lm-2",
    icon: "monitor_heart",
    tags: ["Large Market", "Glass", "Operations", "Exceptions", "Dashboard"],
  },
  {
    title: "Demo OpCon",
    description: "Operational control dashboard for transfer pipeline health, work queues, movement, and switching performance",
    href: "/pages/demo-opcon",
    icon: "conversion_path",
    tags: ["Glass", "Operations", "Pipeline", "Dashboard", "Demo"],
  },
  {
    title: "Glass Vision LM 2 – Demo Version",
    description: "Working copy of Glass Vision LM 2 for demo iterations",
    href: "/pages/glass-vision-lm-2-demo-version",
    icon: "monitor_heart",
    tags: ["Large Market", "Glass", "Operations", "Exceptions", "Dashboard", "Demo"],
  },
  {
    title: "Glass Embedded Networks",
    description: "SUPA Energy Commercial EN view of Glass: network portfolio, fuel-account hierarchy, and EN exception areas",
    href: "/pages/glass-embedded-networks",
    icon: "hub",
    tags: ["Embedded Networks", "Glass", "Commercial", "Exceptions", "Dashboard"],
  },
  {
    title: "Tally Orion",
    description: "ORION-style CRM/account management with contact details and address tables",
    href: "/pages/tally-orion",
    icon: "contact_page",
    tags: ["Tables", "Tabs", "Contacts"],
  },
  {
    title: "Tally Acquire",
    description: "Admin dashboard with system warnings and quick links to configuration areas",
    href: "/pages/tally-acquire",
    icon: "admin_panel_settings",
    tags: ["Dashboard", "Admin", "Tiles"],
  },
  {
    title: "S&A Beta",
    description: "Salesforce-style CRM dashboard with pipeline, leads, opportunities, forecast, and activities",
    href: "/pages/sales-acquisition-dashboard",
    icon: "storefront",
    tags: ["Sales", "CRM", "Pipeline", "Forecast", "Leads"],
  },
  {
    title: "EOS",
    description: "Energy Operations System — enrollment search, batch uploads, customer accounts, and work queue (Tally+ & EOS brands)",
    href: "/pages/eos",
    icon: "bolt",
    tags: ["EOS", "Enrollment", "Operations", "Search", "Forms"],
  },
  {
    title: "EOS Glass",
    description: "EOS call centre agent view with a Residential ⇄ C&I switcher, Adora AI rail, and Japan-localised customer data",
    href: "/pages/eos-glass",
    icon: "support_agent",
    tags: ["EOS", "Glass", "Call centre", "Residential", "C&I"],
  },
  {
    title: "C&I Portal",
    description:
      "End-user Commercial & Industrial portal demos skinned with client brands — starting with SEC Victoria",
    href: "/pages/ci-portal",
    icon: "factory",
    tags: ["C&I", "Client brands", "Dashboard", "Charts", "Billing"],
  },
];

export default function PagesIndex() {
  return (
    <>
      <PageBanner title="Pages" />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Example pages demonstrating how to combine components from the Energy Design System
              into complete, functional interfaces. Use these as references for building new pages
              that follow our design patterns and layout principles.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Link key={page.href} href={page.href} className="group">
                <Card className="h-full shadow-none transition-all hover:border-[#2C365D]/30">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2C365D]/10 transition-colors group-hover:bg-[#2C365D]/20">
                      <Icon name={page.icon} size={24} className="text-[#2C365D]" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#2C365D]">
                      {page.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {page.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {page.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
