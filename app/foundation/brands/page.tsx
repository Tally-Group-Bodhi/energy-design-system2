"use client";

import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";

const brands = [
  {
    title: "Tally Group",
    description: "Main Tally Group brand guidelines and usage",
    href: "/foundation/brands/tally-group",
    logo: "/foundation/brands/tally-group/TallyOfficialLogo.svg",
    icon: "flag",
    tags: ["Main Brand"],
  },
  {
    title: "Tally+",
    description: "Brand guidelines for Tally+ products",
    href: "/foundation/brands/tally-plus",
    logo: "/TallyPlus.svg",
    icon: "add_circle",
    tags: ["Tally+"],
  },
  {
    title: "Tally+ Small Market",
    description: "Brand guidelines for Tally+ Small Market products",
    href: "/foundation/brands/tally-plus-small-market",
    logo: "/foundation/brands/tally-plus-small-market/TallyPlusSMLogo.svg",
    icon: "store",
    tags: ["Tally+", "Small Market"],
  },
  {
    title: "Tally Sales & Acquisition",
    description: "Brand guidelines for Tally Sales & Acquisition",
    href: "/foundation/brands/tally-sales-acquisition",
    logo: "/foundation/brands/tally-sales-acquisition/TallySALogo.svg",
    icon: "trending_up",
    tags: ["Sales", "Acquisition"],
  },
  {
    title: "Tally Digital",
    description: "Brand guidelines for Tally Digital products",
    href: "/foundation/brands/tally-digital",
    logo: "/foundation/brands/tally-digital/TallyDigital.svg",
    icon: "devices",
    tags: ["Digital"],
  },
  {
    title: "Tally CRM",
    description: "Brand guidelines for Tally CRM",
    href: "/foundation/brands/tally-crm",
    logo: "/foundation/brands/tally-crm/TallyCRMLogo.svg",
    icon: "contact_page",
    tags: ["CRM"],
  },
  {
    title: "Tally Glass",
    description: "Logo and brand guidelines for Tally Glass (call centre)",
    href: "/foundation/brands/tally-glass",
    logo: "/foundation/brands/tally-glass/TallyGlassLogo.svg",
    icon: "support_agent",
    tags: ["Call Centre", "Glass"],
  },
  {
    title: "Powered by Tally",
    description: "Powered by Tally badge and its use in the navigation bar",
    href: "/foundation/brands/powered-by-tally",
    logo: "/PoweredByTallyBadge.svg",
    icon: "verified",
    tags: ["Badge", "Navigation"],
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
                    <div className="mb-4 flex min-h-[72px] items-center justify-start">
                      {brand.logo ? (
                        <Image
                          src={brand.logo}
                          alt=""
                          width={160}
                          height={72}
                          className="max-h-[72px] w-auto max-w-full object-contain object-center"
                          unoptimized
                        />
                      ) : (
                        <Icon name={brand.icon as "flag"} size={40} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                      )}
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
