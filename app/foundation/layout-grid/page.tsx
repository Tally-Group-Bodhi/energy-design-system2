"use client";

import { useState } from "react";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";

const breakpoints = [
  { name: "md", min: "768px", desc: "Minimum viable. Search bar appears; internal grids shift to 2-col." },
  { name: "lg", min: "1024px", desc: "Primary target. Full layout shell (nav + panels + main pane) renders." },
  { name: "xl", min: "1280px", desc: "Comfortable. Padding increases; tab bars expand; more grid columns." },
  { name: "2xl", min: "1536px", desc: "Large desktop. Extra grid columns for data-dense views (e.g. LM contacts)." },
];

const containerSizes = [
  { token: "max-w-3xl", px: "768px", use: "Forms, narrow focused content" },
  { token: "max-w-4xl", px: "896px", use: "Articles, long-form text" },
  { token: "max-w-7xl", px: "1280px", use: "Design system doc pages" },
  { token: "max-w-[1600px]", px: "1600px", use: "Product main panes (SM, LM, Glass)" },
];

const spacingScale = [
  { token: "2", px: "8px", use: "Tight gaps (icon + label, inline elements)" },
  { token: "4", px: "16px", use: "Card padding, compact grid gaps" },
  { token: "6", px: "24px", use: "Default section/card gap, grid gutters" },
  { token: "8", px: "32px", use: "Comfortable breathing room between sections" },
  { token: "12", px: "48px", use: "Page vertical rhythm, major group separation" },
];

export default function LayoutGridPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Grid" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Tally products are enterprise desktop applications used by call
              centre agents and back-office staff on laptops and monitors. The
              grid system is designed for these viewports — we don&apos;t target
              mobile or tablet. Content grids, container widths, and spacing
              tokens ensure consistency inside the main pane.
            </p>
          </div>

          {activeTab === "design" && (
            <div className="space-y-14">
              {/* Breakpoints */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Breakpoints
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  The layout shell (nav, panels, app bar) is built for{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">lg</code> and
                  above. Breakpoints below <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">md</code> are
                  not used. Internal content grids may adapt at these four points.
                </p>

                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="w-[100px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Token</th>
                        <th className="w-[120px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Min width</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">What happens</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakpoints.map((bp) => (
                        <tr key={bp.name} className="border-b border-border last:border-b-0">
                          <td className="px-4 py-3 font-mono text-sm text-gray-900">{bp.name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600">{bp.min}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{bp.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">xs</code> (0–639px)
                  and <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">sm</code> (640–767px)
                  are not targeted. The fixed-width nav (64px), Account Context Panel (288px), and
                  Control Panel (290px) require at least 1024px to render properly.
                </p>
              </section>

              {/* Container widths */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Container widths
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  Limit content width for readability. Product main panes use{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">max-w-[1600px]</code>;
                  design system doc pages use{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">max-w-7xl</code>.
                  Pick one per page type.
                </p>

                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="w-[180px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Class</th>
                        <th className="w-[100px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Width</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Use case</th>
                      </tr>
                    </thead>
                    <tbody>
                      {containerSizes.map((c) => (
                        <tr key={c.token} className="border-b border-border last:border-b-0">
                          <td className="px-4 py-3 font-mono text-sm text-gray-900">{c.token}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.px}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{c.use}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Visual comparison */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Visual comparison</p>
                  {containerSizes.map((c) => (
                    <div key={c.token} className="flex items-center gap-3">
                      <span className="w-[140px] shrink-0 text-right font-mono text-xs text-gray-500">{c.token}</span>
                      <div className="h-5 rounded bg-[#2C365D]/10" style={{ width: `${(parseInt(c.px) / 1600) * 100}%`, minWidth: 40 }}>
                        <span className="px-2 text-[10px] font-medium text-[#2C365D]/60 leading-5">{c.px}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Grid system */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Content grids
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  Inside the main pane, use CSS Grid for card layouts and data
                  grids. These are the patterns found in SM, LM, and Glass.
                </p>

                <div className="space-y-8">
                  {/* KPI cards — 4 col */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      KPI cards — 4 columns at <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">lg</code>
                    </p>
                    <p className="mb-3 text-xs text-gray-500">
                      <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">grid grid-cols-2 gap-4 lg:grid-cols-4</code>
                    </p>
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                      {["Revenue", "Accounts", "Usage", "Overdue"].map((label) => (
                        <div
                          key={label}
                          className="flex h-16 flex-col justify-center rounded-lg border border-border bg-white px-4"
                        >
                          <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</span>
                          <span className="mt-0.5 text-lg font-semibold text-gray-800">—</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detail cards — 2 col */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Detail cards — 2 columns
                    </p>
                    <p className="mb-3 text-xs text-gray-500">
                      <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">grid grid-cols-1 gap-4 lg:grid-cols-2</code>
                    </p>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {["Account Summary", "Billing Configuration"].map((label) => (
                        <div
                          key={label}
                          className="rounded-lg border border-border bg-white p-4"
                        >
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                          <div className="mt-2 space-y-1.5">
                            <div className="h-3 w-full rounded bg-gray-100" aria-hidden />
                            <div className="h-3 w-3/4 rounded bg-gray-100" aria-hidden />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data fields — 2/3 col */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Data field grid — 2 or 3 columns
                    </p>
                    <p className="mb-3 text-xs text-gray-500">
                      <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">grid grid-cols-2 gap-x-8 gap-y-4 2xl:grid-cols-3</code>
                    </p>
                    <div className="rounded-lg border border-border bg-white p-4">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 2xl:grid-cols-3">
                        {["Account Number", "Status", "NMI", "Energy Type", "Contract End", "Balance"].map((label) => (
                          <div key={label} className="flex flex-col gap-0.5">
                            <span className="text-[11px] text-gray-400">{label}</span>
                            <span className="text-sm text-gray-800">—</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Spacing */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Spacing scale
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  Use the 4px-based Tailwind spacing scale for padding, margins,
                  and gaps. Keeps vertical rhythm consistent across products.
                </p>

                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="w-[140px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Token</th>
                        <th className="w-[80px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Preview</th>
                        <th className="w-[80px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Size</th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Use case</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spacingScale.map((s) => (
                        <tr key={s.token} className="border-b border-border last:border-b-0">
                          <td className="px-4 py-3 font-mono text-sm text-gray-900">gap-{s.token}</td>
                          <td className="px-4 py-3">
                            <div
                              className="rounded bg-[#2C365D]/15"
                              style={{ width: parseInt(s.px), height: 12 }}
                              aria-hidden
                            />
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.px}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{s.use}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Guidelines */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Guidelines
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  Rules for grid and spacing decisions inside product pages.
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
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Design for lg first</td>
                        <td className="px-4 py-3 text-sm text-gray-600">1024px is the primary viewport. The full layout shell (nav + panels) renders here.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">One max-width per page</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Product panes use <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">max-w-[1600px]</code>. Don&apos;t mix container widths on the same page.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Use the spacing scale</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Stick to the five spacing tokens above. Avoid arbitrary values like <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">p-[13px]</code>.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Consistent grid gaps</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Use <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">gap-4</code> for card grids and <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">gap-6</code> for section grids. Don&apos;t mix gaps within the same grid.</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Don&apos;t target mobile</td>
                        <td className="px-4 py-3 text-sm text-gray-600">The layout shell requires ≥1024px. Don&apos;t add <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">xs:</code> or <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">sm:</code> breakpoints for layout structure.</td>
                      </tr>
                      <tr className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Limit text width</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Body text should not exceed <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">max-w-3xl</code> (~65 characters per line) for readability.</td>
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
                  Main pane wrapper
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  Standard wrapper inside the main pane of product pages.
                </p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`<main className="min-w-0 flex-1 overflow-y-auto">
  <div className="mx-auto max-w-[1600px] px-4 py-4 xl:px-6 xl:py-6">
    {/* page content */}
  </div>
</main>`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  KPI card grid
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Detail cards (2-column)
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
  <CollapsibleCard title="Account Summary">...</CollapsibleCard>
  <CollapsibleCard title="Billing Config">...</CollapsibleCard>
</div>`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Data field grid
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  Used inside cards for label/value pairs. Expands to 3 columns on 2xl.
                </p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`<div className="grid grid-cols-2 gap-x-8 gap-y-4 2xl:grid-cols-3">
  <DataCell label="Account Number" value="104063774" />
  <DataCell label="Status" value="Active" />
  <DataCell label="NMI" value="6305194250" />
</div>`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Spacing tokens
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`// Tight — icon gaps, inline elements
gap-2    // 8px

// Default — card grids, section gaps
gap-4    // 16px
gap-6    // 24px

// Comfortable — between major sections
gap-8    // 32px

// Page rhythm — top-level section breaks
gap-12   // 48px

// Padding patterns
px-4 py-4              // compact pane padding
xl:px-6 xl:py-6        // relaxed at xl+`}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
