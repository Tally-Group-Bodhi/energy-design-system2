"use client";

import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";

const foundationItems = [
  {
    title: "Colours",
    description: "Color system, palettes, and semantic colors for the design system",
    href: "/foundation/colour",
    icon: "palette",
    tags: ["Tokens", "Palette", "Semantic"],
  },
  {
    title: "Cursor Rules",
    description: "AI assistant guide for working with the design system",
    href: "/foundation/cursor-rules",
    icon: "description",
    tags: ["AI", "Guidelines"],
  },
  {
    title: "Icons",
    description: "Material Symbols icon library and usage guidelines",
    href: "/foundation/icons",
    icon: "image",
    tags: ["Icons", "Material Symbols"],
  },
  {
    title: "Layout",
    description: "Application layout structure: app bar, navigation, panes, and control panels",
    href: "/foundation/layout",
    icon: "view_quilt",
    tags: ["Structure", "App Bar", "Navigation"],
  },
  {
    title: "Layout Grid",
    description: "Grid system and responsive layout patterns",
    href: "/foundation/layout-grid",
    icon: "grid_view",
    tags: ["Grid", "Responsive"],
  },
  {
    title: "Logo",
    description: "Tally logo usage and brand guidelines",
    href: "/foundation/logo",
    icon: "flag",
    tags: ["Brand", "Logo"],
  },
  {
    title: "Typography",
    description: "Font families, type scale, and text styles",
    href: "/foundation/typography",
    icon: "text_fields",
    tags: ["Fonts", "Text", "Styles"],
  },
  {
    title: "Panes",
    description: "Content pane patterns and materials",
    href: "/foundation/materials",
    icon: "view_column",
    tags: ["Layout", "Content"],
  },
  {
    title: "Dark Mode",
    description: "Dark mode implementation and guidelines",
    href: "/foundation/dark-mode",
    icon: "dark_mode",
    tags: ["Theme", "Dark Mode"],
  },
];

export default function FoundationIndex() {
  return (
    <>
      <PageBanner title="Foundation" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              Design tokens, patterns, and guidelines that form the foundation of the Tally Energy Design System. These fundamental elements ensure consistency across all products and applications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {foundationItems.map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <Card className="h-full shadow-none transition-all hover:border-[#2C365D]/30">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2C365D]/10 transition-colors group-hover:bg-[#2C365D]/20">
                      <Icon name={item.icon as "palette"} size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#2C365D] dark:text-gray-100 dark:group-hover:text-[#7c8cb8]">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
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
