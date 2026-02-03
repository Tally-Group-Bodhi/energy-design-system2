import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";

const breakpoints = [
  { name: "xs", min: "0px", max: "639px", desc: "Mobile portrait" },
  { name: "sm", min: "640px", max: "767px", desc: "Mobile landscape / large phone" },
  { name: "md", min: "768px", max: "1023px", desc: "Tablet" },
  { name: "lg", min: "1024px", max: "1279px", desc: "Laptop / small desktop" },
  { name: "xl", min: "1280px", max: "1535px", desc: "Desktop" },
  { name: "2xl", min: "1536px", max: "—", desc: "Large desktop" },
];

const containerSizes = [
  { token: "max-w-3xl", px: "768px", use: "Forms, narrow content" },
  { token: "max-w-4xl", px: "896px", use: "Article, long-form" },
  { token: "max-w-5xl", px: "1024px", use: "Medium content" },
  { token: "max-w-6xl", px: "1152px", use: "Wide content" },
  { token: "max-w-7xl", px: "1280px", use: "Default page container" },
  { token: "max-w-[1600px]", px: "1600px", use: "Dashboards, data-heavy" },
];

const spacingScale = [
  { token: "4", px: "16px", use: "Tight (inline, compact)" },
  { token: "6", px: "24px", use: "Default (sections, cards)" },
  { token: "8", px: "32px", use: "Comfortable" },
  { token: "12", px: "48px", use: "Page vertical rhythm" },
  { token: "16", px: "64px", use: "Major section breaks" },
];

export default function LayoutGridPage() {
  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Grid" />

      <TabNavigation tabs={tabs} defaultTab="design" />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Page Description */}
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Our layout and grid system provides a consistent, responsive
              structure for all digital experiences. Use these guidelines to
              align content, maintain rhythm, and ensure interfaces work across
              all key breakpoints and device sizes.
            </p>
          </div>

          {/* Breakpoints Section */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Breakpoints
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              Design and build for these breakpoints so layouts adapt from
              mobile to large desktop. Use mobile-first CSS: base styles for
              smallest viewport, then add <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono">sm:</code>,{" "}
              <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono">md:</code>,{" "}
              <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono">lg:</code>,{" "}
              <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono">xl:</code>,{" "}
              <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono">2xl:</code> for
              larger screens.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 font-semibold text-gray-900">Token</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Min width</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Max width</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Use case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {breakpoints.map((bp) => (
                    <tr key={bp.name}>
                      <td className="px-4 py-3 font-mono text-gray-800">{bp.name}</td>
                      <td className="px-4 py-3 text-gray-600">{bp.min}</td>
                      <td className="px-4 py-3 text-gray-600">{bp.max}</td>
                      <td className="px-4 py-3 text-gray-600">{bp.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Container Widths Section */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Container widths
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              Limit content width for readability and consistency. Use a single
              max-width per page type; combine with horizontal padding for
              responsive gutters.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 font-semibold text-gray-900">Class</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Width</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Use case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {containerSizes.map((c) => (
                    <tr key={c.token}>
                      <td className="px-4 py-3 font-mono text-gray-800">{c.token}</td>
                      <td className="px-4 py-3 text-gray-600">{c.px}</td>
                      <td className="px-4 py-3 text-gray-600">{c.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 max-w-3xl text-sm text-gray-600">
              Standard page wrapper:{" "}
              <code className="rounded bg-gray-200 px-1.5 py-0.5 font-mono">
                mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8
              </code>
            </p>
          </section>

          {/* Grid system Section */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Grid system
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              Use a 12-column grid for complex layouts. Columns collapse to
              full-width on small screens; specify column spans per breakpoint
              for responsive behaviour.
            </p>
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  12-column (responsive): 1 col → 2 col → 3 col
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm font-medium text-gray-500"
                    >
                      Col {n}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Asymmetric: sidebar (4) + main (8) on large; stacked on small
                </p>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <div className="flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 font-medium text-gray-700 lg:col-span-4">
                    Sidebar (4/12)
                  </div>
                  <div className="flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 font-medium text-gray-500 lg:col-span-8">
                    Main (8/12)
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Equal 4-column on large; 2 then 1 on smaller
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="flex h-14 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Spacing scale Section */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Spacing scale
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              Use the 4px-based spacing scale (Tailwind: 1 = 4px) for padding,
              margins, and gaps. Keeps vertical rhythm and alignment consistent.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 font-semibold text-gray-900">Token (e.g. gap-6)</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Size</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Use case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {spacingScale.map((s) => (
                    <tr key={s.token}>
                      <td className="px-4 py-3 font-mono text-gray-800">{s.token}</td>
                      <td className="px-4 py-3 text-gray-600">{s.px}</td>
                      <td className="px-4 py-3 text-gray-600">{s.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Key layout patterns Section */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Key layout patterns
            </h2>
            <p className="mb-8 max-w-3xl text-base leading-6 text-gray-600">
              Standard patterns for common page types. All are responsive:
              simplify columns and reduce density on smaller viewports.
            </p>

            <div className="space-y-12">
              {/* Single column */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Single column
                </h3>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Forms, articles, and focused content. Use max-w-3xl or
                  max-w-4xl; center with mx-auto.
                </p>
                <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
                  <div className="mx-auto h-12 max-w-md rounded bg-gray-100" />
                  <div className="mx-auto mt-4 h-4 max-w-full rounded bg-gray-100" />
                  <div className="mx-auto mt-2 h-4 max-w-[80%] rounded bg-gray-100" />
                </div>
              </div>

              {/* Two column */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Two column (content + sidebar or equal split)
                </h3>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Use grid-cols-1 lg:grid-cols-12 with col-span-8 and col-span-4,
                  or grid-cols-1 md:grid-cols-2 for equal columns.
                </p>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <div className="flex h-20 items-center justify-center rounded bg-gray-100 lg:col-span-8">
                      Main content
                    </div>
                    <div className="flex h-20 items-center justify-center rounded bg-gray-200 lg:col-span-4">
                      Sidebar
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard / cards grid */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Dashboard / cards grid
                </h3>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Responsive card grids: 1 column on mobile, 2 on tablet, 3–4 on
                  desktop. Use grid with gap-6 and consistent card heights where
                  appropriate.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="flex h-24 flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="h-4 w-1/3 rounded bg-gray-200" />
                      <div className="mt-2 h-3 w-full rounded bg-gray-100" />
                      <div className="mt-1 h-3 w-2/3 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Full-bleed with constrained content */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Full-bleed with constrained content
                </h3>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Background or banner spans full width; inner content uses
                  max-w-7xl (or other container) with px-4 sm:px-6 lg:px-8.
                </p>
                <div className="rounded-lg border border-gray-200 bg-gray-100">
                  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="h-10 rounded bg-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Guidelines / Do's and Don'ts */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Guidelines
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-800">
                  <span aria-hidden>✓</span> Do
                </h3>
                <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
                  <li>Use mobile-first breakpoints (base, then sm/md/lg/xl/2xl)</li>
                  <li>Keep horizontal padding consistent (px-4, sm:px-6, lg:px-8)</li>
                  <li>Limit line length for text (max-w-3xl or less for body)</li>
                  <li>Use the same container width per page type</li>
                  <li>Stack columns on small screens; add columns as width increases</li>
                  <li>Use the spacing scale for gaps and padding</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-800">
                  <span aria-hidden>✗</span> Don&apos;t
                </h3>
                <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
                  <li>Mix arbitrary max-widths on the same page</li>
                  <li>Assume desktop-only; always test mobile and tablet</li>
                  <li>Use fixed pixel widths for layout; prefer max-w and %</li>
                  <li>Overcrowd small viewports with too many columns</li>
                  <li>Skip horizontal padding on narrow screens</li>
                  <li>Ignore touch targets (min 44px) on interactive elements</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
