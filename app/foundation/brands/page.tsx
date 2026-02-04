"use client";

import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";

const brands = [
  {
    title: "Tally Group",
    description: "Main Tally Group brand guidelines and usage",
    href: "/foundation/brands/tally-group",
    icon: "flag",
    tags: ["Main Brand"],
  },
  {
    title: "Tally Small Market",
    description: "Brand guidelines for Tally Small Market products",
    href: "/foundation/brands/tally-small-markets",
    icon: "store",
    tags: ["Small Market"],
  },
  {
    title: "Tally Large Market",
    description: "Brand guidelines for Tally Large Market products",
    href: "/foundation/brands/tally-large-market",
    icon: "business",
    tags: ["Large Market"],
  },
  {
    title: "Tally Sales & Acquisition",
    description: "Brand guidelines for Tally Sales & Acquisition",
    href: "/foundation/brands/tally-sales-acquisition",
    icon: "trending_up",
    tags: ["Sales", "Acquisition"],
  },
  {
    title: "Tally Digital",
    description: "Brand guidelines for Tally Digital products",
    href: "/foundation/brands/tally-digital",
    icon: "devices",
    tags: ["Digital"],
  },
  {
    title: "Tally CRM",
    description: "Brand guidelines for Tally CRM",
    href: "/foundation/brands/tally-crm",
    icon: "contact_page",
    tags: ["CRM"],
  },
];

export default function BrandsIndex() {
  return (
    <>
      <PageBanner title="Brands" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              Brand variants and guidelines for different Tally products. Each brand has specific visual identity, logo usage, and design patterns while maintaining consistency with the overall design system.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <Link key={brand.href} href={brand.href} className="group">
                <Card className="h-full shadow-none transition-all hover:border-[#2C365D]/30">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2C365D]/10 transition-colors group-hover:bg-[#2C365D]/20">
                      <Icon name={brand.icon as "flag"} size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#2C365D] dark:text-gray-100 dark:group-hover:text-[#7c8cb8]">
                      {brand.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {brand.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {brand.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
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
