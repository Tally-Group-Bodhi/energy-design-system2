import PageBanner from "@/components/PageBanner/PageBanner";
import { Card, CardContent } from "@/components/Card/Card";
import { surfaceColours, SURFACE_NEUTRAL } from "@/lib/tokens/surface-colours";
import type { SurfaceColourKey } from "@/lib/tokens/surface-colours";

const BRAND_SURFACE_RULES: { brand: string; key: SurfaceColourKey; layers: string; usage: string }[] = [
  { brand: "Tally CRM", key: "tally-crm", layers: "sky / blue", usage: "CRM dashboard, cases, pipeline, opportunities; Glass Energy Dashboard (CRM nav)." },
  { brand: "Tally Group", key: "tally-group", layers: "slate / blue", usage: "Default / group-level apps; Beta Test Dashboard; Tally Orion; Tally Large Market." },
  { brand: "Tally+", key: "tally-plus", layers: "slate / blue", usage: "Tally+ product templates (navy palette)." },
  { brand: "Tally+ Small Market", key: "tally-plus-small-market", layers: "teal / emerald", usage: "Small Market template; retail energy UIs." },
  { brand: "Tally Sales & Acquisition", key: "tally-sales-acquisition", layers: "violet / purple", usage: "S&A Dashboard; Tally Acquire template." },
  { brand: "Tally Digital", key: "tally-digital", layers: "orange / amber", usage: "Tally Digital product templates." },
  { brand: "Tally Glass", key: "tally-glass", layers: "slate / blue", usage: "Tally Glass template (call centre)." },
  { brand: "Powered by Tally", key: "powered-by-tally", layers: "—", usage: "Neutral surface only; no brand tint." },
];

export default function SurfaceColourPage() {
  return (
    <>
      <PageBanner title="Surface Colour" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              The main content area (Pane) of each application uses a <strong>layered gradient</strong> (two layers, same opacity rule in light and dark). Light: layer1 at 50%→70%, layer2 at 30%→50%. Dark: layer1 at 15%→25%, layer2 at 10%→20%. Each brand uses a pair of Tailwind semantic colors (e.g. sky/blue for CRM, slate/blue for Group). Classes live in <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">globals.css</code>.
            </p>
          </div>

          {/* Example: Tally CRM */}
          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Example: Tally CRM
            </h2>
            <p className="mb-6 max-w-3xl text-base text-gray-600 dark:text-gray-400">
              Tally CRM uses a <strong>layered gradient</strong> (sky and blue) so the main pane feels softly branded in both light and dark mode.
            </p>
            <div className="overflow-hidden rounded-lg border-2 border-border bg-white dark:bg-gray-800">
              <div className={`min-h-[200px] ${surfaceColours["tally-crm"]} p-6`}>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Main content area (Pane)
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Light: sky-50/50 → sky-50/70, blue-50/30 → blue-50/50. Dark: sky-950/15 → sky-950/25, blue-950/10 → blue-950/20.
                </p>
                <div className="mt-6 rounded-lg border border-border bg-white/80 p-4 shadow-sm dark:bg-gray-800/80 dark:border-gray-700">
                  <p className="text-xs text-muted-foreground">Card / content on surface</p>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Class <code className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">surface-crm</code> (defined in <code className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">globals.css</code>).
            </p>
          </section>

          {/* Rules per brand */}
          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Surface colour by brand
            </h2>
            <p className="mb-6 max-w-3xl text-base text-gray-600 dark:text-gray-400">
              Each Tally brand maps to a surface class (layered gradient). Use the token from <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">lib/tokens/surface-colours.ts</code> on the main content wrapper (the scrollable pane). Light and dark both use the same opacity pattern; only the base colors change.
            </p>
            <div className="overflow-hidden rounded-lg border border-border bg-white dark:bg-gray-800">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50 dark:bg-gray-900/50">
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">Brand</th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">Layers</th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">Token key</th>
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">Where used</th>
                  </tr>
                </thead>
                <tbody>
                  {BRAND_SURFACE_RULES.map((row) => (
                    <tr key={row.key} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{row.brand}</td>
                      <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{row.layers}</td>
                      <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">&quot;{row.key}&quot;</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Live swatches */}
          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              All brand surfaces
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(Object.entries(surfaceColours) as [SurfaceColourKey, string][]).map(([key, className]) => (
                <Card key={key} className="overflow-hidden shadow-none">
                  <div className={`min-h-[120px] ${className} p-4`}>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{key.replace(/-/g, " ")}</p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Pane surface</p>
                  </div>
                  <CardContent className="py-2 px-3">
                    <code className="text-xs text-muted-foreground break-all">{key}</code>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Usage in code */}
          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Usage
            </h2>
            <p className="mb-4 max-w-3xl text-base text-gray-600 dark:text-gray-400">
              Apply the surface class to the main content wrapper (e.g. the <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">&lt;main&gt;</code> or the inner scrollable div). Use <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">getSurfaceClass(brand)</code> when the brand is dynamic.
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-gray-900 px-4 py-4 text-sm text-gray-100">
{`import { surfaceColours, getSurfaceClass } from "@/lib/tokens/surface-colours";

// Fixed brand (e.g. CRM layout)
<main className={\`flex-1 overflow-y-auto \${surfaceColours["tally-crm"]}\`}>

// Dynamic brand
<main className={\`flex-1 overflow-y-auto \${getSurfaceClass("tally-plus-small-market")}\`}>`}
            </pre>
          </section>
        </div>
      </div>
    </>
  );
}
