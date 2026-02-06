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
    title: "Tally Large Market",
    description: "Customer account management page with collapsible cards and tabbed navigation",
    href: "/pages/tally-large-market",
    icon: "account_circle",
    tags: ["Tabs", "Cards", "Forms"],
  },
  {
    title: "Forms",
    description: "Form examples demonstrating input fields, validation, and form layouts",
    href: "/pages/forms",
    icon: "edit_note",
    tags: ["Inputs", "Validation", "Layout"],
  },
  {
    title: "Tally Glass",
    description: "Tally Glass page within the Energy Design System",
    href: "/pages/tally-glass",
    icon: "precision_manufacturing",
    tags: ["Tally Glass"],
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
