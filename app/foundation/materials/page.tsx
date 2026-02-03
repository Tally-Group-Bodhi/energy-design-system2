"use client";

import PageBanner from "@/components/PageBanner/PageBanner";

function PanesTable({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: { example: React.ReactNode; name: string; usage: string }[];
}) {
  return (
    <section className="border-t border-border pt-10">
      <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
        {title}
      </h2>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
        {description}
      </p>
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-gray-50/80">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Example
              </th>
              <th className="w-[180px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Class name
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Usage
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-4 align-middle">
                  {row.example}
                </td>
                <td className="w-[180px] px-4 py-4 font-mono text-xs text-gray-600 align-middle">
                  {row.name}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 align-middle">
                  {row.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const BOX_CLASS = "h-[100px] w-[240px] shrink-0 bg-white";

export default function PanesPage() {
  const surfaceRows = [
    {
      example: (
        <div className={`${BOX_CLASS} rounded-md border border-border`} />
      ),
      name: "pane-base",
      usage: "Everyday use. Radius 6px. Default cards and containers.",
    },
    {
      example: (
        <div className={`${BOX_CLASS} rounded-md border border-border shadow-sm`} />
      ),
      name: "pane-small",
      usage: "Slightly raised. Radius 6px. Hover states, subtle elevation.",
    },
    {
      example: (
        <div className={`${BOX_CLASS} rounded-lg border border-border shadow-sm`} />
      ),
      name: "pane-medium",
      usage: "Further raised. Radius 8px. Cards and panels.",
    },
    {
      example: (
        <div className={`${BOX_CLASS} rounded-xl border border-border shadow-sm`} />
      ),
      name: "pane-large",
      usage: "Larger radius. Radius 12px. Feature cards, sections.",
    },
  ];

  const floatingRows = [
    {
      example: (
        <div className={`${BOX_CLASS} rounded-md border border-border shadow-sm`} />
      ),
      name: "pane-tooltip",
      usage: "Lightest shadow. Corner 6px. Tooltips and popovers with a stem.",
    },
    {
      example: (
        <div className={`${BOX_CLASS} rounded-lg border border-border shadow-md`} />
      ),
      name: "pane-menu",
      usage: "Lift from page. Radius 8px. Dropdowns and context menus.",
    },
    {
      example: (
        <div className={`${BOX_CLASS} rounded-xl border border-border shadow-lg`} />
      ),
      name: "pane-modal",
      usage: "Further lift. Radius 12px. Dialogs and modals.",
    },
    {
      example: (
        <div className={`${BOX_CLASS} rounded-2xl border border-border shadow-xl`} />
      ),
      name: "pane-fullscreen",
      usage: "Biggest lift. Radius 16px. Sheets and fullscreen overlays.",
    },
  ];

  return (
    <>
      <PageBanner title="Panes" />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="max-w-3xl text-base leading-7 text-gray-600">
              Presets for radii, fills, strokes, and shadows. Use these
              pane classes for consistent elevation and corners across
              surfaces and floating UI.
            </p>
          </div>

          <div className="space-y-12">
            <PanesTable
              title="Surface"
              description="On the page."
              rows={surfaceRows}
            />

            <PanesTable
              title="Floating"
              description="Above the page."
              rows={floatingRows}
            />
          </div>
        </div>
      </div>
    </>
  );
}
