"use client";

import { useState } from "react";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { Icon } from "@/components/ui/icon";

const REGION_SPECS = [
  { region: "Brand strip", dimension: "h-1 (4px)", detail: "Full-width coloured bar at the very top. Identifies the product brand." },
  { region: "App bar", dimension: "h-14 (56px)", detail: "Logo (left), search (centre), avatar & actions (right). Always fixed at top." },
  { region: "Nav — collapsed", dimension: "w-16 (64px)", detail: "Icon-only rail. Used in SM, LM, and Glass (Glass is always collapsed)." },
  { region: "Nav — expanded", dimension: "w-64 (256px)", detail: "Icons + labels with sub-items. SM and LM toggle between collapsed/expanded." },
  { region: "Account Context Panel", dimension: "w-72 (288px)", detail: "Customer/account summary strip. Used in SM and LM, left of the main pane." },
  { region: "Main pane", dimension: "flex-1, max-w-[1600px]", detail: "Primary content area. Scrolls vertically; all other regions stay fixed." },
  { region: "Control panel", dimension: "w-[290px]", detail: "Right-hand panel for tasks, cross-sell, actions. SM and LM; collapsible." },
  { region: "Side panel (Glass)", dimension: "w-80 (320px)", detail: "Glass uses two fixed-width side panels (left + right) instead of Account Context Panel + Control Panel." },
];

const PRODUCT_VARIANTS = [
  {
    name: "Tally+ Small Market",
    slug: "SM",
    surface: "tally-crm",
    layout: "App bar → Nav (collapsible) → Account Context Panel → Main pane → Control panel",
    nav: "Collapsible w-16 / w-64",
    leftPanel: "Account Context Panel (w-72)",
    rightPanel: "Control Panel (w-[290px])",
    notes: "2-pane variant: account context + main. Right panel toggles.",
  },
  {
    name: "Tally+ Large Market",
    slug: "LM",
    surface: "tally-group",
    layout: "App bar → Nav (collapsible) → Account Context Panel → Main pane → Control panel",
    nav: "Collapsible w-16 / w-64",
    leftPanel: "Account Context Panel (w-72)",
    rightPanel: "Control Panel (w-[290px])",
    notes: "Same shell as SM but with more nav items and richer main content (tabs, cards).",
  },
  {
    name: "Tally Glass",
    slug: "Glass",
    surface: "tally-glass",
    layout: "App bar → Compact nav → Left sidebar → Main pane → Right sidebar (Adora AI)",
    nav: "Fixed compact w-16",
    leftPanel: "Customer sidebar (w-80)",
    rightPanel: "Adora AI sidebar (w-80)",
    notes: "3-pane: call centre agents see customer + content + AI insights side by side.",
  },
];

function WireframeLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider ${className ?? ""}`}>
      {children}
    </span>
  );
}

function SmLmWireframe() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      {/* Brand strip */}
      <div className="h-1.5 bg-[#2C365D]" />
      {/* App bar */}
      <div className="flex h-10 items-center border-b border-gray-200 bg-white px-3">
        <div className="h-4 w-20 rounded bg-[#2C365D]/20" aria-hidden />
        <div className="mx-auto h-5 w-28 rounded-md border border-gray-200 bg-gray-50" aria-hidden />
        <div className="h-5 w-5 rounded-full bg-gray-200" aria-hidden />
      </div>
      {/* Body */}
      <div className="flex" style={{ minHeight: 200 }}>
        {/* Nav */}
        <div className="flex w-10 shrink-0 flex-col items-center gap-1.5 border-r border-gray-200 bg-gray-50 pt-2">
          <WireframeLabel className="text-gray-400 mb-1">Nav</WireframeLabel>
          <div className="h-4 w-4 rounded bg-gray-300/70" aria-hidden />
          <div className="h-4 w-4 rounded bg-gray-200/70" aria-hidden />
          <div className="h-4 w-4 rounded bg-gray-200/70" aria-hidden />
          <div className="h-4 w-4 rounded bg-gray-200/70" aria-hidden />
        </div>
        {/* Account Context Panel */}
        <div className="flex w-20 shrink-0 flex-col border-r border-gray-200 bg-white p-2 pt-2">
          <WireframeLabel className="text-[#2C365D]/60 mb-2">Account</WireframeLabel>
          <div className="space-y-1.5">
            <div className="h-3 w-full rounded bg-[#2C365D]/10" aria-hidden />
            <div className="h-3 w-3/4 rounded bg-[#2C365D]/8" aria-hidden />
            <div className="h-3 w-full rounded bg-[#2C365D]/8" aria-hidden />
            <div className="h-3 w-2/3 rounded bg-[#2C365D]/6" aria-hidden />
          </div>
        </div>
        {/* Main pane */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#F9F9FB] p-3 pt-2">
          <WireframeLabel className="text-gray-400 mb-2">Main pane</WireframeLabel>
          <div className="mb-2 h-3 w-28 rounded bg-gray-200/80" aria-hidden />
          <div className="space-y-1">
            <div className="h-2.5 w-full rounded bg-gray-200/60" aria-hidden />
            <div className="h-2.5 w-[90%] rounded bg-gray-200/60" aria-hidden />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="h-14 rounded border border-dashed border-gray-300" />
            <div className="h-14 rounded border border-dashed border-gray-300" />
          </div>
        </div>
        {/* Control panel */}
        <div className="flex w-20 shrink-0 flex-col border-l border-gray-200 bg-white p-2 pt-2">
          <WireframeLabel className="text-[#0074C4]/60 mb-2">Control</WireframeLabel>
          <div className="space-y-1.5">
            <div className="h-6 rounded bg-[#0074C4]/8" aria-hidden />
            <div className="h-6 rounded bg-[#0074C4]/8" aria-hidden />
            <div className="h-6 rounded bg-[#0074C4]/6" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassWireframe() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      {/* App bar */}
      <div className="flex h-10 items-center border-b border-gray-200 bg-white px-3">
        <div className="h-4 w-20 rounded bg-[#2C365D]/20" aria-hidden />
        <div className="mx-auto h-5 w-28 rounded-md border border-gray-200 bg-gray-50" aria-hidden />
        <div className="h-5 w-5 rounded-full bg-gray-200" aria-hidden />
      </div>
      {/* Body */}
      <div className="flex" style={{ minHeight: 200 }}>
        {/* Compact nav */}
        <div className="flex w-8 shrink-0 flex-col items-center gap-1.5 border-r border-gray-200 bg-gray-50 pt-2">
          <WireframeLabel className="text-gray-400 mb-0.5" />
          <div className="h-3.5 w-3.5 rounded bg-gray-300/70" aria-hidden />
          <div className="h-3.5 w-3.5 rounded bg-gray-200/70" aria-hidden />
          <div className="h-3.5 w-3.5 rounded bg-gray-200/70" aria-hidden />
          <div className="h-3.5 w-3.5 rounded bg-gray-200/70" aria-hidden />
        </div>
        {/* Left sidebar */}
        <div className="flex w-24 shrink-0 flex-col border-r border-gray-200 bg-white p-2 pt-2">
          <WireframeLabel className="text-purple-400/80 mb-2">Customer</WireframeLabel>
          <div className="mb-2 flex items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-purple-200/60" aria-hidden />
            <div className="h-2.5 w-14 rounded bg-purple-200/40" aria-hidden />
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 w-full rounded bg-gray-200/60" aria-hidden />
            <div className="h-2.5 w-3/4 rounded bg-gray-200/50" aria-hidden />
            <div className="h-2.5 w-full rounded bg-gray-200/50" aria-hidden />
          </div>
        </div>
        {/* Main pane */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#F9F9FB] p-3 pt-2">
          <WireframeLabel className="text-gray-400 mb-2">Main pane</WireframeLabel>
          <div className="mb-2 h-3 w-24 rounded bg-gray-200/80" aria-hidden />
          <div className="space-y-1">
            <div className="h-2.5 w-full rounded bg-gray-200/60" aria-hidden />
            <div className="h-2.5 w-[85%] rounded bg-gray-200/60" aria-hidden />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="h-12 rounded border border-dashed border-gray-300" />
            <div className="h-12 rounded border border-dashed border-gray-300" />
          </div>
        </div>
        {/* Adora AI sidebar */}
        <div className="flex w-24 shrink-0 flex-col border-l border-gray-200 bg-white p-2 pt-2">
          <WireframeLabel className="text-emerald-500/70 mb-2">Adora AI</WireframeLabel>
          <div className="space-y-1.5">
            <div className="h-10 rounded border border-gray-200 bg-emerald-50/50 p-1" aria-hidden>
              <div className="h-2 w-10 rounded bg-emerald-200/60" />
              <div className="mt-0.5 h-1.5 w-full rounded bg-gray-200/40" />
            </div>
            <div className="h-10 rounded border border-gray-200 bg-emerald-50/50 p-1" aria-hidden>
              <div className="h-2 w-8 rounded bg-emerald-200/60" />
              <div className="mt-0.5 h-1.5 w-full rounded bg-gray-200/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LayoutPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Layout" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Every Tally product shares a common layout shell: an app bar at
              the top, collapsible navigation on the left, and a scrollable
              main pane in the centre. Products add their own panels — SM and LM
              include an Account Context Panel and a Control Panel; Glass uses
              a customer sidebar and an AI insights sidebar.
            </p>
          </div>

          {activeTab === "design" && (
            <div className="space-y-14">
              {/* Anatomy */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Anatomy
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  The layout is composed of up to six regions. Not every product
                  uses all of them — see Product variants below.
                </p>

                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  {/* Brand strip */}
                  <div className="relative h-2.5 bg-[#2C365D]">
                    <WireframeLabel className="absolute left-2 top-0 text-white/80">Brand strip · h-1</WireframeLabel>
                  </div>
                  {/* App bar */}
                  <div className="relative flex h-12 items-center border-b border-gray-200 bg-white px-4">
                    <WireframeLabel className="text-[#2C365D]/60">App bar · h-14</WireframeLabel>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-[#2C365D]/15" aria-hidden />
                      <div className="h-4 w-28 rounded bg-[#2C365D]/10" aria-hidden />
                      <div className="h-6 w-6 rounded-full bg-[#2C365D]/15" aria-hidden />
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex" style={{ minHeight: 260 }}>
                    {/* Nav collapsed */}
                    <div className="relative flex w-12 shrink-0 flex-col items-center gap-2 border-r border-[#00D2A2]/20 bg-[#00D2A2]/5 py-4 pt-3">
                      <WireframeLabel className="text-[#00D2A2]/70 mb-1">Nav</WireframeLabel>
                      <div className="h-5 w-5 rounded bg-[#00D2A2]/25" aria-hidden />
                      <div className="h-5 w-5 rounded bg-[#00D2A2]/15" aria-hidden />
                      <div className="h-5 w-5 rounded bg-[#00D2A2]/15" aria-hidden />
                      <div className="h-5 w-5 rounded bg-[#00D2A2]/15" aria-hidden />
                      <div className="mt-auto text-[9px] font-medium text-[#00D2A2]/50">w-16</div>
                    </div>
                    {/* Optional left panel */}
                    <div className="relative flex w-28 shrink-0 flex-col border-r border-gray-200 bg-white p-3 pt-3">
                      <WireframeLabel className="text-[#2C365D]/50 mb-2">Left panel</WireframeLabel>
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-[#2C365D]/8" aria-hidden />
                        <div className="h-3 w-3/4 rounded bg-[#2C365D]/6" aria-hidden />
                        <div className="h-3 w-full rounded bg-[#2C365D]/6" aria-hidden />
                        <div className="h-3 w-2/3 rounded bg-[#2C365D]/5" aria-hidden />
                      </div>
                      <div className="mt-auto text-[9px] font-medium text-gray-400">w-72 / w-80</div>
                    </div>
                    {/* Main pane */}
                    <div className="relative flex min-w-0 flex-1 flex-col bg-[#F9F9FB] p-4 pt-3">
                      <WireframeLabel className="text-gray-400 mb-2">Main pane · flex-1</WireframeLabel>
                      <div className="mb-3 h-4 w-40 rounded bg-gray-200/80" aria-hidden />
                      <div className="space-y-1.5">
                        <div className="h-3 w-full rounded bg-gray-200/60" aria-hidden />
                        <div className="h-3 w-[90%] rounded bg-gray-200/60" aria-hidden />
                        <div className="h-3 w-3/4 rounded bg-gray-200/60" aria-hidden />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="h-16 rounded-lg border-2 border-dashed border-gray-300/60" />
                        <div className="h-16 rounded-lg border-2 border-dashed border-gray-300/60" />
                      </div>
                      <div className="mt-auto pt-3 text-[9px] font-medium text-gray-400">max-w-[1600px] · overflow-y-auto</div>
                    </div>
                    {/* Optional right panel */}
                    <div className="relative flex w-28 shrink-0 flex-col border-l border-gray-200 bg-white p-3 pt-3">
                      <WireframeLabel className="text-[#0074C4]/50 mb-2">Right panel</WireframeLabel>
                      <div className="space-y-2">
                        <div className="h-8 rounded bg-[#0074C4]/6" aria-hidden />
                        <div className="h-8 rounded bg-[#0074C4]/6" aria-hidden />
                        <div className="h-8 rounded bg-[#0074C4]/5" aria-hidden />
                      </div>
                      <div className="mt-auto text-[9px] font-medium text-gray-400">w-[290px] / w-80</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dimensions */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Dimensions
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  Fixed dimensions used across SM, LM, and Glass. The main pane
                  is the only region that flexes; everything else is a fixed width.
                </p>

                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Region</th>
                        <th className="w-[200px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Dimension</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REGION_SPECS.map((r) => (
                        <tr key={r.region} className="border-b border-border last:border-b-0">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.region}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.dimension}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Product variants */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Product variants
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  SM and LM share the same layout shell (collapsible nav + Account
                  Context Panel + Control Panel). Glass uses a different arrangement:
                  a fixed compact nav with two equal-width sidebars flanking the
                  main pane.
                </p>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* SM / LM wireframe */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Small Market &amp; Large Market
                    </p>
                    <SmLmWireframe />
                    <p className="mt-2 text-xs text-gray-500">
                      Nav (w-16 / w-64) → Account Context Panel (w-72) → Main pane (flex-1) → Control Panel (w-[290px])
                    </p>
                  </div>
                  {/* Glass wireframe */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Tally Glass
                    </p>
                    <GlassWireframe />
                    <p className="mt-2 text-xs text-gray-500">
                      Compact Nav (w-16) → Customer sidebar (w-80) → Main pane (flex-1) → Adora AI sidebar (w-80)
                    </p>
                  </div>
                </div>

                {/* Comparison table */}
                <div className="mt-8 overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Feature</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">SM / LM</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Glass</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Root wrapper</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">flex h-screen flex-col overflow-hidden</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">flex min-h-screen flex-col</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Brand strip</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Yes (h-1)</td>
                        <td className="px-4 py-3 text-sm text-gray-600">No</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Navigation</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Collapsible: w-16 ↔ w-64</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Fixed compact: w-16</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Left panel</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Account Context Panel (w-72)</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Customer sidebar (w-80)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Right panel</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Control Panel (w-[290px]), collapsible</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Adora AI sidebar (w-80), always visible</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Surface colour</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">tally-crm / tally-group</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">tally-glass</td>
                      </tr>
                      <tr className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Content max-width</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">max-w-[1600px]</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">max-w-[1600px]</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Region details */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  App bar
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  Fixed at the top of the screen. All products use the same
                  three-zone structure: logo/brand left, search centre, avatar
                  and actions right. Height is always <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">h-14</code> (56px).
                </p>
                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Rule</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Height</td>
                        <td className="px-4 py-3 text-sm text-gray-600"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">h-14</code> (56px). Never changes.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Left zone</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Product logo. Links back to home.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Centre zone</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Search input with <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">max-w-md</code>. Hidden on mobile.</td>
                      </tr>
                      <tr className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Right zone</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Notification bell, avatar. Additional actions per product.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Collapsible navigation
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  A vertical rail on the left. SM and LM support toggling
                  between collapsed (icon-only) and expanded (icons + labels)
                  states. Glass keeps it always collapsed.
                </p>
                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Rule</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Collapsed width</td>
                        <td className="px-4 py-3 text-sm text-gray-600"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">w-16</code> (64px). Icon-only, centred.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Expanded width</td>
                        <td className="px-4 py-3 text-sm text-gray-600"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">w-64</code> (256px). Icons + labels with expandable sub-items.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Transition</td>
                        <td className="px-4 py-3 text-sm text-gray-600"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">transition-[width] duration-300</code>. Smooth width animation.</td>
                      </tr>
                      <tr className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Toggle</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Chevron button at the bottom of the nav. State persists locally.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Main pane
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  The only region that scrolls. It fills all remaining
                  horizontal space and is capped at <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">max-w-[1600px]</code>.
                  A surface colour gradient (brand Lighter → #F9F9FB) is applied
                  as the pane background.
                </p>
                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Rule</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Width</td>
                        <td className="px-4 py-3 text-sm text-gray-600"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">min-w-0 flex-1</code>. Fills remaining space.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Max width</td>
                        <td className="px-4 py-3 text-sm text-gray-600"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">max-w-[1600px]</code>. Prevents content stretching on ultra-wide screens.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Scroll</td>
                        <td className="px-4 py-3 text-sm text-gray-600"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">overflow-y-auto</code>. Only the pane scrolls; app bar and side panels stay fixed.</td>
                      </tr>
                      <tr className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Background</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Surface colour from <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">surfaceColours[&quot;brand-key&quot;]</code>. See Surface Colour page.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Side panels
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  Optional panels flanking the main pane. SM and LM use the
                  Account Context Panel (left) and a Control Panel (right).
                  Glass uses equal-width Customer and Adora AI sidebars.
                </p>
                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Panel</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Products</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Width</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Behaviour</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Account Context Panel</td>
                        <td className="px-4 py-3 text-sm text-gray-600">SM, LM</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">w-72 (288px)</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Always visible. Displays customer name, NMI, account status, contacts.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Control Panel</td>
                        <td className="px-4 py-3 text-sm text-gray-600">SM, LM</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">w-[290px]</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Collapsible. Tasks, cross-sell actions, and quick links.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Customer sidebar</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Glass</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">w-80 (320px)</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Always visible. Customer identity, services, payment history.</td>
                      </tr>
                      <tr className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Adora AI sidebar</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Glass</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">w-80 (320px)</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Always visible. AI-generated insights, bill analysis, next-best actions.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Scroll behaviour */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Scroll behaviour
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  The root element uses <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">overflow-hidden</code> so
                  the browser&apos;s native scrollbar only appears inside the main
                  pane. This keeps the app bar and side panels pinned.
                </p>
                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Region</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Scroll</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Root / body</td>
                        <td className="px-4 py-3 text-sm text-gray-600"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">overflow-hidden</code> — no body scroll.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">App bar</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Fixed. Never scrolls.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Navigation</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Fixed. Internal scroll if nav items exceed height.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Main pane</td>
                        <td className="px-4 py-3 text-sm text-gray-600"><code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">overflow-y-auto</code> — the only scrollable region.</td>
                      </tr>
                      <tr className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Side panels</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Fixed height. Internal scroll if content exceeds panel height.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeTab === "code" && (
            <div className="space-y-10 border-t border-border pt-10">
              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Layout shell (SM / LM)
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  The layout used by Tally+ Small Market and Large Market.
                  Account Context Panel on the left, Control Panel on the right.
                </p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`<div className="flex h-screen flex-col overflow-hidden">
  {/* Brand strip */}
  <div className="h-1 bg-[brandColour]" />

  {/* App bar */}
  <header className="flex h-14 shrink-0 items-center border-b px-6">
    <Logo />
    <SearchInput className="mx-auto max-w-md" />
    <Avatar />
  </header>

  {/* Body */}
  <div className="flex min-w-0 flex-1 overflow-hidden">
    {/* Nav */}
    <nav className={\`\${navOpen ? "w-64" : "w-16"} shrink-0
      transition-[width] duration-300\`}>
      {/* nav items */}
    </nav>

    {/* Surface wrapper */}
    <div className={\`flex min-w-0 flex-1 overflow-hidden
      \${surfaceColours["brand-key"]}\`}>

      {/* Account Context Panel */}
      <AccountContextPanel className="w-72 shrink-0" />

      {/* Main pane — only scrollable region */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1600px] p-6">
          {/* page content */}
        </div>
      </main>
    </div>

    {/* Control Panel */}
    {panelOpen && (
      <aside className="w-[290px] shrink-0 border-l">
        {/* tasks, cross-sell */}
      </aside>
    )}
  </div>
</div>`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Layout shell (Glass)
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  Tally Glass uses a fixed compact nav and two equal-width
                  sidebars.
                </p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`<div className="flex min-h-screen flex-col">
  {/* App bar */}
  <header className="flex h-14 shrink-0 items-center border-b px-6">
    <Logo />
    <SearchInput className="mx-auto max-w-md" />
    <Avatar />
  </header>

  {/* Body */}
  <div className="flex flex-1 overflow-hidden">
    {/* Compact nav — always collapsed */}
    <aside className="flex w-16 shrink-0 flex-col items-center
      border-r py-4">
      {/* icon buttons */}
    </aside>

    {/* Customer sidebar */}
    <aside className="w-80 shrink-0 border-r overflow-y-auto">
      {/* customer identity, services */}
    </aside>

    {/* Main pane */}
    <main className={\`min-w-0 flex-1 overflow-y-auto
      \${surfaceColours["tally-glass"]}\`}>
      <div className="mx-auto max-w-[1600px] p-6">
        {/* page content */}
      </div>
    </main>

    {/* Adora AI sidebar */}
    <aside className="w-80 shrink-0 border-l overflow-y-auto">
      {/* AI insights */}
    </aside>
  </div>
</div>`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Surface colour
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  Apply the product&apos;s surface colour to the main pane wrapper.
                </p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`import { surfaceColours } from "@/lib/tokens/surface-colours";

// Apply to the pane or its wrapper
<div className={\`... \${surfaceColours["tally-crm"]}\`}>
  {/* SM content */}
</div>

// Available keys:
// "tally-crm", "tally-group", "tally-plus",
// "tally-plus-small-market", "tally-sales-acquisition",
// "tally-digital", "tally-glass", "powered-by-tally"`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Key classes reference
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`// Root — prevent body scroll
flex h-screen flex-col overflow-hidden

// Body row — holds nav + content + panels
flex min-w-0 flex-1 overflow-hidden

// Nav toggle animation
transition-[width] duration-300

// Main pane — only scrollable region
min-w-0 flex-1 overflow-y-auto

// Content max width
mx-auto max-w-[1600px]

// Fixed-width panels
shrink-0           // prevent flex shrink
w-72 / w-80        // left panel
w-[290px] / w-80   // right panel`}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
