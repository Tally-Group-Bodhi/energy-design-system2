import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import { DESIGN_SYSTEM_VERSION } from "@/lib/version";

const CHANGELOG: { version: string; date: string; changes: string[] }[] = [
  {
    version: "1.5.6",
    date: "2026-02-24",
    changes: [
      "Glass Vision (Template): new call centre page at /pages/glass-vision with customer account panels, Adora AI summary, expandable billing/usage details, Insights tab with charts, and glassmorphism UI.",
      "Full-screen toggle: expand/contract button on Glass Vision nav hides the design system sidebar for distraction-free viewing.",
      "Sidebar navigation: removed Tally Glass and Glass Energy Dashboard; replaced with Glass Vision.",
    ],
  },
  {
    version: "1.5.5",
    date: "2026-02-23",
    changes: [
      "Colours (Foundation): semantic tokens updated — System (yellow) #EAB308; Warning #E8560A with Warning Light #FFF4E6. See Colours page and lib/tokens/colors.ts.",
    ],
  },
  {
    version: "1.5.4",
    date: "2026-02-23",
    changes: [
      "Surface Colour (Foundation): new foundation page at /foundation/surface-colour with CRM example, brand table (layers per brand), live swatches, and usage; “Surface Colour” added to sidebar Foundation section.",
      "Surface colour tokens: lib/tokens/surface-colours.ts with surfaceColours and getSurfaceClass(brand); layered gradient classes in globals.css for all brands (CRM: sky/blue; Group/Plus/Glass: slate/blue; Small Market: teal/emerald; S&A: violet/purple; Digital: orange/amber).",
      "Surface gradients applied to CRM layout, Glass Energy Dashboard, Small Market, S&A Dashboard, Tally Acquire, Tally Glass, Beta Test Dashboard, Tally Orion, Tally Large Market.",
      "Tally Glass brand page and logo assets at /foundation/brands/tally-glass and public/foundation/brands/tally-glass/.",
      "Layout and .cursorrules: Pane and Surface Colour documented; token keys and usage added.",
    ],
  },
  {
    version: "1.5.3",
    date: "2026-02-18",
    changes: [
      "Powered by Tally brand page: new foundation page at /foundation/brands/powered-by-tally with two badge variants (light and dark/REV), download links, and “Use in the nav bar” section with NavigationBar demos.",
      "Powered by Tally added to Brands section in sidebar navigation and to the brands index with a dedicated card.",
      "Powered by Tally dark variant (REV): new asset PoweredByTallyBadgeREV.svg; NavigationBar, Sidebar, and all pages using the dark badge now reference this file.",
      "Brands index: brand cards show respective logos (Tally Group, Tally+, Tally+ Small Market, Tally Sales & Acquisition, Tally Digital, Tally CRM, Powered by Tally) where assets exist; icons used when no logo is available.",
      "Brands index: removed grey box around logos; logos are larger (72px row), consistent, and left-aligned.",
    ],
  },
  {
    version: "1.5.2",
    date: "2025-02-13",
    changes: [
      "Version display: 'Version 1.5.' with patch number as underlined link to changelog; patch (e.g. 2) is the only part that updates between releases.",
      "Changelog page: entries use 1.5.x versioning (1.5.1, 1.5.2).",
    ],
  },
  {
    version: "1.5.1",
    date: "2025-02-13",
    changes: [
      "Sidebar: atomic design navigation (Elements, Components, Patterns, Templates), collapsible sections, flyout item list when collapsed.",
      "Sidebar & NavigationBar: Powered by Tally badge and collapse toggle in one row; collapse icon on the right.",
      "Sidebar section icons: Elements (palette), Brands (filter_vintage), Components (deployed_code), Patterns (widgets), Templates (newsmode).",
      "Version number centralised in lib/version.ts; version link to changelog page.",
      "Small Market page: Select components use defaultValue to fix controlled-component warning.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <PageBanner title="Changelog" />
      <div className="p-6">
        <p className="mb-8 text-muted-foreground">
          Version history and changes for the Tally Energy Design System. Current
          version:{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {DESIGN_SYSTEM_VERSION}
          </span>
          .{" "}
          <Link
            href="/"
            className="text-[#2C365D] underline underline-offset-2 hover:no-underline dark:text-[#00D2A2]"
          >
            Back to home
          </Link>
        </p>
        <ul className="space-y-8">
          {CHANGELOG.map((entry) => (
            <li
              key={entry.version}
              className="rounded-lg border border-border bg-white p-6 dark:border-gray-700 dark:bg-gray-800/40"
            >
              <div className="mb-2 flex items-baseline gap-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {entry.version}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {entry.date}
                </span>
              </div>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {entry.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
