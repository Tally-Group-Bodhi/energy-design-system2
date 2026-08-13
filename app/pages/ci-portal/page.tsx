"use client";

import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";
import { clientBrands, type ClientBrandKey } from "@/lib/tokens/client-brands";

/** Client demo pages available in the portal. */
const demoPages: {
  brandKey: ClientBrandKey;
  href: string;
  description: string;
  tags: string[];
}[] = [
  {
    brandKey: "sec-victoria",
    href: "/pages/ci-portal/sec-victoria",
    description:
      "Commercial & industrial customer home: account context, billing summary, regional spot prices, and consumption analytics.",
    tags: ["Dashboard", "Charts", "Billing", "Spot prices"],
  },
  {
    brandKey: "ampol",
    href: "/pages/ci-portal/ampol",
    description:
      "Ampol C&I portal demo: same layout and density as SEC Victoria, skinned with Ampol blue and red.",
    tags: ["Dashboard", "Charts", "Settlements", "Network"],
  },
  {
    brandKey: "cleanco",
    href: "/pages/ci-portal/cleanco",
    description:
      "CleanCo Queensland C&I portal demo: cyan and charcoal brand skin with warm neutrals.",
    tags: ["Dashboard", "Charts", "Settlements", "Network"],
  },
  {
    brandKey: "energy-australia",
    href: "/pages/ci-portal/energy-australia",
    description:
      "EnergyAustralia C&I portal demo: deep green brand skin with teal success signalling.",
    tags: ["Dashboard", "Charts", "Settlements", "Network"],
  },
];

export default function CiPortalIndex() {
  return (
    <>
      <PageBanner title="C&I Portal" />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-lg leading-7 text-gray-600">
              End-user demo pages for the Commercial &amp; Industrial portal.
              Each page keeps the design system&apos;s layout, spacing, density
              and component behaviour, but is skinned with a client&apos;s own
              colours and logo — so a client sees their brand while we build on
              one system underneath.
            </p>
            <p className="mt-4 text-lg leading-7 text-gray-600">
              Client palettes, logo paths and chart series live in{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-base text-gray-800">
                lib/tokens/client-brands.ts
              </code>
              . Adding a client means adding one entry there plus its logo assets
              — the page layout stays untouched.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoPages.map((page) => {
              const brand = clientBrands[page.brandKey];
              const cardLogo =
                page.brandKey === "sec-victoria"
                  ? brand.logos.standard
                  : brand.logos.reversed;
              return (
                <Link key={page.href} href={page.href} className="group">
                  <Card className="h-full shadow-none transition-all hover:border-[#2C365D]/30">
                    <CardHeader>
                      <div
                        className="mb-3 flex h-12 items-center justify-start rounded-lg px-3"
                        style={{ backgroundColor: brand.colours.primaryStrong }}
                      >
                        <Image
                          {...cardLogo}
                          alt={brand.name}
                          className="h-7 w-auto"
                        />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#2C365D]">
                        {brand.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {page.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 flex items-center gap-1.5">
                        {[
                          brand.colours.primary,
                          brand.colours.accent,
                          ...brand.chart.series.slice(0, 2),
                        ].map((colour) => (
                          <span
                            key={colour}
                            className="h-5 w-5 rounded-full border border-black/5"
                            style={{ backgroundColor: colour }}
                            title={colour}
                          />
                        ))}
                      </div>
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
              );
            })}

            <Card className="flex h-full items-center justify-center border-dashed bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
                <Icon name="add_circle" size={28} className="text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  More client brands to come
                </p>
                <p className="max-w-[220px] text-sm text-muted-foreground">
                  Add a brand entry and logo assets, then copy the SEC Victoria
                  page as a starting point.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
