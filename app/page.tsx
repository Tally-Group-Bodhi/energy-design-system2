import Link from "next/link";
import Image from "next/image";
import PageBanner from "@/components/PageBanner/PageBanner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";

const quickLinks = [
  {
    title: "Foundation",
    description: "Colours, typography, layout, icons, and design tokens",
    href: "/foundation/colour",
    icon: "palette",
    color: "bg-[#2C365D]",
  },
  {
    title: "Components",
    description: "Reusable UI components built for energy sector applications",
    href: "/components/button",
    icon: "widgets",
    color: "bg-[#00D2A2]",
  },
  {
    title: "Pages",
    description: "Example page implementations and patterns",
    href: "/pages",
    icon: "dashboard",
    color: "bg-[#0074C4]",
  },
  {
    title: "Brands",
    description: "Brand variants and guidelines for Tally products",
    href: "/foundation/brands/tally-group",
    icon: "flag",
    color: "bg-[#F59E0B]",
  },
];

export default function Home() {
  return (
    <>
      <PageBanner title="Tally Energy Design System" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Welcome section */}
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              A comprehensive design system for energy sector products: call center tools, customer dashboards, and related applications. Built with Next.js, React, and Tailwind CSS.
            </p>
          </div>

          {/* Quick links */}
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Get started
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="group">
                  <Card className="h-full shadow-none transition-all hover:border-[#2C365D]/30 hover:shadow-md">
                    <CardHeader>
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${link.color} transition-colors group-hover:opacity-90`}>
                        <Icon name={link.icon as "palette"} size={24} className="text-white" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#2C365D] dark:text-gray-100 dark:group-hover:text-[#7c8cb8]">
                        {link.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {link.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Features section */}
          <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Features
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2C365D]/10 dark:bg-[#7c8cb8]/20">
                  <Icon name="check_circle" size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Component Library
                </h3>
                <p className="text-base leading-6 text-gray-600 dark:text-gray-400">
                  Pre-built components for forms, tables, charts, navigation, and more. All components follow consistent design patterns and are fully accessible.
                </p>
              </div>
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2C365D]/10 dark:bg-[#7c8cb8]/20">
                  <Icon name="palette" size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Design Tokens
                </h3>
                <p className="text-base leading-6 text-gray-600 dark:text-gray-400">
                  Comprehensive color system, typography scale, spacing, and layout tokens. Supports multiple brand variants and dark mode.
                </p>
              </div>
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2C365D]/10 dark:bg-[#7c8cb8]/20">
                  <Icon name="code" size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Developer Friendly
                </h3>
                <p className="text-base leading-6 text-gray-600 dark:text-gray-400">
                  Built with TypeScript, fully documented, and optimized for use with Cursor AI. Includes example pages and patterns to get started quickly.
                </p>
              </div>
            </div>
          </section>

          {/* Resources section */}
          <section className="border-t border-border pt-16 dark:border-gray-700">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Resources
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/foundation/cursor-rules"
                className="flex items-center gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-[#2C365D]/30 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800/80"
              >
                <Icon name="description" size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Cursor Rules</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI assistant guide</p>
                </div>
              </Link>
              <Link
                href="/foundation/typography"
                className="flex items-center gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-[#2C365D]/30 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800/80"
              >
                <Icon name="text_fields" size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Typography</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fonts and text styles</p>
                </div>
              </Link>
              <Link
                href="/foundation/layout"
                className="flex items-center gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-[#2C365D]/30 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800/80"
              >
                <Icon name="view_quilt" size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Layout</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Page structure patterns</p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
