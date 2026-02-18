"use client";

import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import type { NavigationItem } from "@/components/NavigationBar/NavigationBar";

const LOGO_BASE = "/foundation/brands/tally-plus-small-market";

const logos = [
  { name: "Primary (full colour)", file: "TallyPlusSMLogo.svg", bg: "bg-white", label: "Light background" },
  { name: "Reversed (full colour)", file: "TallyPlusSMLogoReversed.svg", bg: "bg-[#298268]", label: "Dark background" },
  { name: "Mono (single colour)", file: "TallyPlusSMLogoMono.svg", bg: "bg-white", label: "Light background" },
  { name: "Mono reversed", file: "TallyPlusSMLogoMonoReversed.svg", bg: "bg-[#298268]", label: "Dark background" },
] as const;

const tallyPlusSMPalette = [
  { name: "Lighter", hex: "#E7FBF8" },
  { name: "Light", hex: "#A7F0E5" },
  { name: "Turquoise", hex: "#4EEECA" },
  { name: "Dark", hex: "#3BB89A" },
  { name: "Darker", hex: "#298268" },
];

const tallyPlusSMNavItems: NavigationItem[] = [
  { id: "home", label: "Home", href: "#", icon: "home" },
  { id: "dashboard", label: "Dashboard", href: "#", icon: "dashboard" },
  { id: "opportunities", label: "Opportunities", href: "#", icon: "trending_up" },
  { id: "reports", label: "Reports", href: "#", icon: "assessment" },
];

const tallyPlusSMBottomItems: NavigationItem[] = [
  { id: "help", label: "Help", href: "#", icon: "help" },
  { id: "settings", label: "Settings", href: "#", icon: "settings" },
];

// Use Darker (#298268) for fonts and icons whenever Lighter/Light is used as background (accessibility).
const tallyPlusSMActiveColors = {
  bg: "bg-[#E7FBF8]",
  text: "text-[#298268]",
  darkBg: "dark:bg-[#E7FBF8]/15",
  darkText: "dark:text-[#A7F0E5]",
};

const BRAND_TURQUOISE = "#4EEECA";
const DARKER = "#298268";
const DARK = "#3BB89A";

export default function TallyPlusSmallMarketPage() {
  return (
    <>
      <PageBanner title="Tally+ Small Market" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              Color is key to the immediate brand recognition of our suite of products. The products powered by Tally+ Small Market are distinguishable by their dedicated brand colors.
            </p>
          </div>

          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Logo
            </h2>
            <p className="mb-6 max-w-3xl text-base text-gray-600 dark:text-gray-400">
              Use the official Tally+ Small Market logo in the correct variant for your background. Download the asset you need below.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {logos.map((logo) => (
                <Card key={logo.file} className="overflow-hidden shadow-none">
                  <div className={`flex min-h-[72px] items-center justify-center p-4 ${logo.bg}`}>
                    <Image
                      src={`${LOGO_BASE}/${logo.file}`}
                      alt={logo.name}
                      width={140}
                      height={28}
                      className="max-h-10 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                  <CardHeader className="pb-1 pt-3">
                    <CardTitle className="text-sm">{logo.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{logo.label}</p>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    <a
                      href={`${LOGO_BASE}/${logo.file}`}
                      download={logo.file}
                      className="inline-flex items-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon name="download" size={14} className="mr-1.5" />
                      Download SVG
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16 border-t border-border pt-20">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              UI colours
            </h2>
            <p className="mb-8 max-w-3xl text-base text-gray-600 dark:text-gray-400">
              Tally+ Small Market UI palette for navigation, headers, buttons, and surfaces. Based on #4EEECA.
            </p>
            <div className="flex flex-col rounded-lg overflow-hidden sm:flex-row">
              {tallyPlusSMPalette.map((c) => {
                const useLightText = [DARK, DARKER].includes(c.hex);
                return (
                  <div
                    key={c.hex}
                    className="flex flex-1 flex-col items-center justify-end py-6 text-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className={useLightText ? "text-white" : "text-gray-900"}>
                      {c.name}
                    </span>
                    <span className={`font-mono text-sm ${useLightText ? "text-white/90" : "text-gray-700"}`}>
                      {c.hex}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Brand colour rules
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
              Apply brand colors to different areas of an interface not only to create visual prominence, but also to anchor people in a specific product experience. Avoid overusing brand colors or using them on large surfaces as they can dilute a hierarchy and make an experience difficult to navigate.
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600 dark:text-gray-400">
              <li>Use turquoise (#4EEECA) for primary actions, selected states, and key UI anchors.</li>
              <li>Use <strong>Darker (#298268)</strong> for all text and icons on Lighter or Light backgrounds (e.g. active nav) for contrast.</li>
              <li>Reserve brand colour for one primary CTA or active nav item rather than many.</li>
              <li>Avoid full-width or large blocks of turquoise; use for buttons, icons, and highlights.</li>
              <li>Use Lighter and Light shades for backgrounds and borders to support hierarchy.</li>
            </ul>
          </section>

          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Brand colour in the interface
            </h2>
            <p className="mb-8 max-w-3xl text-base text-gray-600 dark:text-gray-400">
              Examples of using Tally+ Small Market colours for buttons, selected states, navigation, and app layout.
            </p>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Buttons and CTAs</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <button
                    type="button"
                    className="w-full rounded-lg px-4 py-2.5 text-center font-medium text-gray-900 transition-colors"
                    style={{ backgroundColor: BRAND_TURQUOISE }}
                  >
                    One (primary)
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center font-medium text-gray-800 transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  >
                    Two (secondary)
                  </button>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Selected states</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50">
                    <span className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      A▾
                    </span>
                    <span
                      className="rounded px-2 py-1 text-sm font-bold text-gray-900"
                      style={{ backgroundColor: BRAND_TURQUOISE }}
                    >
                      B
                    </span>
                    <span className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      I
                    </span>
                    <span className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      U
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Brand colour indicates the active option (e.g. Bold selected).
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10">
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Navigation active state</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Use brand colour for the active nav item so users know where they are.
                  </p>
                </CardHeader>
                <CardContent>
                  <nav
                    className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800/50"
                    aria-label="Example nav"
                  >
                    <a
                      href="#"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      Dashboard
                    </a>
                    <a
                      href="#"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-900"
                      style={{ backgroundColor: BRAND_TURQUOISE }}
                    >
                      Opportunities
                    </a>
                    <a
                      href="#"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      Reports
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10">
              <Card className="overflow-hidden shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">App header and page layout</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Tally Acquire–style nav bar with Tally+ Small Market logo. A 4px brand colour line sits above the app bar; content area stays neutral.
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="rounded-lg border border-gray-200 overflow-hidden dark:border-gray-700">
                    <div
                      className="h-1 shrink-0"
                      style={{ backgroundColor: BRAND_TURQUOISE }}
                      aria-hidden
                    />
                    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-6 dark:border-gray-800 dark:bg-gray-950/90">
                      <div className="flex items-center gap-4">
                        <Link href="/foundation/brands/tally-plus-small-market" className="flex items-center">
                          <Image
                            src={`${LOGO_BASE}/TallyPlusSMLogo.svg`}
                            alt="Tally+ Small Market"
                            width={140}
                            height={28}
                            className="h-8 w-auto dark:hidden"
                            unoptimized
                          />
                          <Image
                            src={`${LOGO_BASE}/TallyPlusSMLogoReversed.svg`}
                            alt="Tally+ Small Market"
                            width={140}
                            height={28}
                            className="h-8 w-auto hidden dark:block"
                            unoptimized
                          />
                        </Link>
                      </div>
                      <div className="flex flex-1 justify-center">
                        <div className="relative hidden w-full max-w-md md:block">
                          <Icon
                            name="search"
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                          />
                          <input
                            type="search"
                            placeholder="Search"
                            className="h-10 w-full rounded-lg border border-border bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#4EEECA] focus:outline-none focus:ring-1 focus:ring-[#4EEECA] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-100"
                        >
                          <Icon name="notifications" size={20} />
                        </button>
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-gray-900"
                          style={{ backgroundColor: BRAND_TURQUOISE }}
                        >
                          SM
                        </div>
                      </div>
                    </header>
                    <div className="flex">
                      <aside className="flex w-48 shrink-0 flex-col border-r border-border bg-white dark:border-gray-800 dark:bg-gray-950">
                        <nav className="flex flex-col gap-1 p-2">
                          <div className="mx-2 rounded-lg bg-[#E7FBF8] px-3 py-2.5 text-sm font-medium text-[#298268] dark:bg-[#E7FBF8]/15 dark:text-[#A7F0E5]">
                            Home
                          </div>
                          <div className="mx-2 rounded-lg px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400">
                            Settings
                          </div>
                        </nav>
                      </aside>
                      <main className="min-w-0 flex-1 bg-[#F9F9FB] p-6 dark:bg-gray-900">
                        <div className="h-24 rounded-lg border border-dashed border-gray-300 dark:border-gray-600" />
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                          Content area uses neutral background; brand colour is limited to the 4px line, app bar logo, and active nav.
                        </p>
                      </main>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Nav Bar
            </h2>
            <p className="mb-6 max-w-3xl text-base text-gray-600 dark:text-gray-400">
              The navigation bar uses Tally+ Small Market brand colours for the active item and hover states. The active item uses the <strong>Lighter</strong> UI colour (#E7FBF8) as background, with <strong>Darker</strong> (#298268) for icons and text for clear contrast. Always use Darker for fonts and icons on Lighter or Light backgrounds. In <strong>collapsed</strong> mode only icons are shown; hover an icon to see its label in a tooltip. In <strong>expanded</strong> mode labels are visible. Click items to see the active state.
            </p>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="border-b border-border px-4 py-3 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Collapsed
                  </span>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Hover icons for tooltips; active item uses Lighter background.
                  </p>
                </div>
                <div className="flex min-h-[420px]">
                  <NavigationBar
                    items={tallyPlusSMNavItems}
                    bottomItems={tallyPlusSMBottomItems}
                    defaultActiveId="home"
                    collapsed={true}
                    onCollapsedChange={() => {}}
                    compact
                    activeColors={tallyPlusSMActiveColors}
                  />
                  <div className="flex-1 border-l border-border bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/30" />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="border-b border-border px-4 py-3 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expanded
                  </span>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Active background Lighter (#E7FBF8); icons and text use Darker (#298268).
                  </p>
                </div>
                <div className="flex min-h-[420px]">
                  <NavigationBar
                    items={tallyPlusSMNavItems}
                    bottomItems={tallyPlusSMBottomItems}
                    defaultActiveId="home"
                    collapsed={false}
                    onCollapsedChange={() => {}}
                    compact
                    activeColors={tallyPlusSMActiveColors}
                  />
                  <div className="flex-1 border-l border-border bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/30" />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-border pt-8">
            <Link
              href="/foundation/brands"
              className="text-sm font-medium text-[#298268] hover:underline dark:text-[#A7F0E5]"
            >
              ← Back to Brands
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
