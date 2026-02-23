import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";

export default function LayoutPage() {
  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Layout" />

      <TabNavigation tabs={tabs} defaultTab="design" />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Page Description */}
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Application layout defines the structure of the screen: a top app
              bar, collapsible navigation on the left, main content in the
              centre (Pane), and a control panel on the right. The patterns on
              this page describe how these regions work together in this design
              system.
            </p>
          </div>

          {/* Parts of layout – Visual outline */}
          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Parts of layout
            </h2>
            <p className="mb-8 max-w-3xl text-base leading-6 text-gray-600">
              The layout is composed of four regions: App bar (top), Collapsible
              navigation (left), Pane (centre), and Control panel (right).
              The middle area holds the primary content and can be a single pane
              or split into 2 or even 4 panes.
            </p>

            {/* Layout wireframe – muted brand/data colours: primary, turquoise, light, info */}
            <div className="overflow-hidden rounded-lg border-2 border-border bg-white">
              {/* App bar – muted primary (navy #2C365D) */}
              <div className="relative flex h-14 items-center gap-3 border-b border-[#2C365D]/20 bg-[#2C365D]/10 px-4">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-wide text-[#2C365D]/70">
                  App bar
                </span>
                <div className="ml-auto flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-[#2C365D]/25" aria-hidden />
                  <div className="h-4 w-32 rounded bg-[#2C365D]/20" aria-hidden />
                  <div className="h-8 w-24 rounded bg-[#2C365D]/20" aria-hidden />
                </div>
              </div>

              <div className="flex min-h-[320px]">
                {/* Nav – muted secondary (turquoise #00D2A2) */}
                <aside className="relative flex w-16 flex-shrink-0 flex-col items-center border-r border-[#00D2A2]/25 bg-[#00D2A2]/10 py-3 md:w-52 md:items-stretch md:px-3">
                  <span className="absolute left-2 top-2 text-xs font-medium uppercase tracking-wide text-[#00D2A2]/80 md:left-3">
                    Nav
                  </span>
                  <div className="mt-8 flex flex-col gap-2 md:mt-10 md:gap-2">
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/25 md:w-full" aria-hidden />
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/15 md:w-full" aria-hidden />
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/15 md:w-full" aria-hidden />
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/15 md:w-full" aria-hidden />
                  </div>
                </aside>

                {/* Pane – surface colour: gradient from brand Lighter to #F9F9FB (see Surface Colour) */}
                <main className="relative min-w-0 flex-1 border-r border-border bg-[#F9F9FB] p-6">
                  <span className="absolute left-4 top-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Pane
                  </span>
                  <div className="mt-6 mb-4 h-5 w-48 rounded bg-gray-200/80" aria-hidden />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200/60" aria-hidden />
                    <div className="h-4 w-full max-w-[90%] rounded bg-gray-200/60" aria-hidden />
                    <div className="h-4 w-3/4 rounded bg-gray-200/60" aria-hidden />
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="h-24 rounded-lg border-2 border-dashed border-border" />
                    <div className="h-24 rounded-lg border-2 border-dashed border-border" />
                  </div>
                </main>

                {/* Control panel – muted info (#0074C4) */}
                <aside className="relative hidden w-0 flex-shrink-0 border-[#0074C4]/20 bg-[#0074C4]/8 lg:block lg:w-72 lg:border-l">
                  <span className="absolute left-4 top-3 text-xs font-medium uppercase tracking-wide text-[#0074C4]/80">
                    Control panel
                  </span>
                  <div className="p-4 pt-8">
                    <div className="mb-4 h-4 w-28 rounded bg-[#0074C4]/20" aria-hidden />
                    <div className="space-y-3">
                      <div className="h-10 rounded bg-[#0074C4]/15" aria-hidden />
                      <div className="h-10 rounded bg-[#0074C4]/15" aria-hidden />
                      <div className="h-10 rounded bg-[#0074C4]/15" aria-hidden />
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Single pane. App bar (top), Nav (left), Pane
              (centre), Control panel (right, visible from lg breakpoint).
            </p>

            {/* 2 panes wireframe – same muted colours */}
            <p className="mt-10 mb-2 text-sm font-medium text-gray-700">
              2 panes
            </p>
            <div className="overflow-hidden rounded-lg border-2 border-border bg-white">
              <div className="relative flex h-14 items-center gap-3 border-b border-[#2C365D]/20 bg-[#2C365D]/10 px-4">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-wide text-[#2C365D]/70">
                  App bar
                </span>
                <div className="ml-auto flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-[#2C365D]/25" aria-hidden />
                  <div className="h-4 w-32 rounded bg-[#2C365D]/20" aria-hidden />
                  <div className="h-8 w-24 rounded bg-[#2C365D]/20" aria-hidden />
                </div>
              </div>
              <div className="flex min-h-[320px]">
                <aside className="relative flex w-16 flex-shrink-0 flex-col items-center border-r border-[#00D2A2]/25 bg-[#00D2A2]/10 py-3 md:w-52 md:items-stretch md:px-3">
                  <span className="absolute left-2 top-2 text-xs font-medium uppercase tracking-wide text-[#00D2A2]/80 md:left-3">
                    Nav
                  </span>
                  <div className="mt-8 flex flex-col gap-2 md:mt-10 md:gap-2">
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/25 md:w-full" aria-hidden />
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/15 md:w-full" aria-hidden />
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/15 md:w-full" aria-hidden />
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/15 md:w-full" aria-hidden />
                  </div>
                </aside>
                <main className="flex min-w-0 flex-1 flex-col border-r border-border bg-[#F9F9FB]">
                  <div className="grid flex-1 grid-cols-2 gap-0 divide-x divide-gray-200">
                    <div className="relative flex flex-col p-4">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Pane 1
                      </span>
                      <div className="mt-4 h-4 w-3/4 rounded bg-gray-200/60" aria-hidden />
                      <div className="mt-2 h-4 w-full rounded bg-gray-200/60" aria-hidden />
                      <div className="mt-2 h-20 rounded border-2 border-dashed border-border" />
                    </div>
                    <div className="relative flex flex-col p-4">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Pane 2
                      </span>
                      <div className="mt-4 h-5 w-32 rounded bg-gray-200/80" aria-hidden />
                      <div className="mt-3 space-y-2">
                        <div className="h-4 w-full rounded bg-gray-200/60" aria-hidden />
                        <div className="h-4 w-3/4 rounded bg-gray-200/60" aria-hidden />
                      </div>
                    </div>
                  </div>
                </main>
                <aside className="relative hidden w-0 flex-shrink-0 border-[#0074C4]/20 bg-[#0074C4]/8 lg:block lg:w-72 lg:border-l">
                  <span className="absolute left-4 top-3 text-xs font-medium uppercase tracking-wide text-[#0074C4]/80">
                    Control panel
                  </span>
                  <div className="p-4 pt-8">
                    <div className="mb-4 h-4 w-28 rounded bg-[#0074C4]/20" aria-hidden />
                    <div className="space-y-3">
                      <div className="h-10 rounded bg-[#0074C4]/15" aria-hidden />
                      <div className="h-10 rounded bg-[#0074C4]/15" aria-hidden />
                      <div className="h-10 rounded bg-[#0074C4]/15" aria-hidden />
                    </div>
                  </div>
                </aside>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              2 panes: e.g. list | detail or master-detail.
            </p>

            {/* 3 panes wireframe – same muted colours */}
            <p className="mt-10 mb-2 text-sm font-medium text-gray-700">
              3 panes
            </p>
            <div className="overflow-hidden rounded-lg border-2 border-border bg-white">
              {/* App bar */}
              <div className="relative flex h-14 items-center gap-3 border-b border-[#2C365D]/20 bg-[#2C365D]/10 px-4">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-wide text-[#2C365D]/70">
                  App bar
                </span>
                <div className="ml-auto flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-[#2C365D]/25" aria-hidden />
                  <div className="h-4 w-32 rounded bg-[#2C365D]/20" aria-hidden />
                  <div className="h-8 w-24 rounded bg-[#2C365D]/20" aria-hidden />
                </div>
              </div>
              <div className="flex min-h-[320px]">
                {/* Nav */}
                <aside className="relative flex w-16 flex-shrink-0 flex-col items-center border-r border-[#00D2A2]/25 bg-[#00D2A2]/10 py-3">
                  <span className="absolute left-2 top-2 text-xs font-medium uppercase tracking-wide text-[#00D2A2]/80 md:left-3">
                    Nav
                  </span>
                  <div className="mt-8 flex flex-col gap-2">
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/25" aria-hidden />
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/15" aria-hidden />
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/15" aria-hidden />
                    <div className="h-8 w-8 rounded bg-[#00D2A2]/15" aria-hidden />
                  </div>
                </aside>

                {/* 3-pane area */}
                <div className="flex min-w-0 flex-1 border-r border-border">
                  {/* Pane 1 – left sidebar */}
                  <div className="relative flex w-1/4 min-w-[120px] flex-col border-r border-gray-200 bg-[#F9F9FB] p-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Pane 1
                    </span>
                    <div className="mt-4 space-y-2">
                      <div className="h-10 rounded bg-gray-200/70" aria-hidden />
                      <div className="h-3 w-3/4 rounded bg-gray-200/50" aria-hidden />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-10 rounded bg-gray-200/70" aria-hidden />
                      <div className="h-3 w-3/4 rounded bg-gray-200/50" aria-hidden />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-10 rounded bg-gray-200/70" aria-hidden />
                      <div className="h-3 w-3/4 rounded bg-gray-200/50" aria-hidden />
                    </div>
                  </div>

                  {/* Pane 2 – main content (largest) */}
                  <div className="relative flex min-w-0 flex-1 flex-col bg-[#F9F9FB] p-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Pane 2
                    </span>
                    <div className="mt-4 mb-3 h-5 w-48 rounded bg-gray-200/80" aria-hidden />
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-gray-200/60" aria-hidden />
                      <div className="h-4 w-full max-w-[90%] rounded bg-gray-200/60" aria-hidden />
                      <div className="h-4 w-3/4 rounded bg-gray-200/60" aria-hidden />
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="h-20 rounded-lg border-2 border-dashed border-border" />
                      <div className="h-20 rounded-lg border-2 border-dashed border-border" />
                    </div>
                  </div>

                  {/* Pane 3 – right detail/assistant */}
                  <div className="relative flex w-1/4 min-w-[120px] flex-col border-l border-gray-200 bg-[#F9F9FB] p-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Pane 3
                    </span>
                    <div className="mt-4 mb-3 h-4 w-20 rounded bg-gray-200/70" aria-hidden />
                    <div className="space-y-3">
                      <div className="h-16 rounded-lg border border-gray-200 bg-white p-2" aria-hidden>
                        <div className="mb-1 h-3 w-16 rounded bg-gray-200/80" />
                        <div className="h-2 w-full rounded bg-gray-200/50" />
                        <div className="mt-1 h-2 w-3/4 rounded bg-gray-200/50" />
                      </div>
                      <div className="h-16 rounded-lg border border-gray-200 bg-white p-2" aria-hidden>
                        <div className="mb-1 h-3 w-16 rounded bg-gray-200/80" />
                        <div className="h-2 w-full rounded bg-gray-200/50" />
                        <div className="mt-1 h-2 w-3/4 rounded bg-gray-200/50" />
                      </div>
                      <div className="h-16 rounded-lg border border-gray-200 bg-white p-2" aria-hidden>
                        <div className="mb-1 h-3 w-16 rounded bg-gray-200/80" />
                        <div className="h-2 w-full rounded bg-gray-200/50" />
                        <div className="mt-1 h-2 w-3/4 rounded bg-gray-200/50" />
                      </div>
                    </div>
                    <div className="mt-auto pt-4">
                      <div className="h-10 rounded-lg border border-gray-200 bg-white" aria-hidden />
                    </div>
                  </div>
                </div>

                {/* Control panel */}
                <aside className="relative hidden w-0 flex-shrink-0 border-[#0074C4]/20 bg-[#0074C4]/8 lg:block lg:w-72 lg:border-l">
                  <span className="absolute left-4 top-3 text-xs font-medium uppercase tracking-wide text-[#0074C4]/80">
                    Control panel
                  </span>
                  <div className="p-4 pt-8">
                    <div className="mb-4 h-4 w-28 rounded bg-[#0074C4]/20" aria-hidden />
                    <div className="space-y-3">
                      <div className="h-10 rounded bg-[#0074C4]/15" aria-hidden />
                      <div className="h-10 rounded bg-[#0074C4]/15" aria-hidden />
                      <div className="h-10 rounded bg-[#0074C4]/15" aria-hidden />
                    </div>
                  </div>
                </aside>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              3 panes: e.g. sidebar | main content | assistant/detail — as used
              in Tally Glass (customer details, service overview, AI insights).
            </p>
          </section>

          {/* App bar */}
          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              App bar
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              The app bar sits at the top of the layout. It typically contains
              navigation trigger (e.g. menu to open/close the left nav), title
              or branding, and primary actions (e.g. search, profile, theme).
              It remains visible when scrolling so key actions are always
              available.
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>Fixed at top; full width</li>
              <li>Navigation trigger (left) toggles collapsible nav</li>
              <li>Title or app name in the centre or left-after-trigger</li>
              <li>Actions on the right</li>
            </ul>
          </section>

          {/* Collapsible navigation */}
          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Collapsible navigation
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              The left rail is a collapsible navigation area. It can show as
              icon-only when collapsed (narrow width) and expand to show labels
              when open. Use it for global navigation: main sections, key
              destinations, and possibly secondary links. On small viewports it
              can become a drawer that overlays content and closes after
              selection.
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>Collapsed: icon-only rail (e.g. 64px width)</li>
              <li>Expanded: icons + labels (e.g. 256px width)</li>
              <li>Can overlay as a sheet/drawer on mobile</li>
              <li>Persists state (collapsed/expanded) per user when appropriate</li>
            </ul>
          </section>

          {/* Pane */}
          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Pane
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              The centre of the layout is the main content area, referred to as
              the Pane. It can be a single pane (e.g. list, form, or dashboard)
              or the pane area can be made up of 2 or even 4 panes—for example
              list and detail, or a multi-column dashboard. Panes can resize or
              stack on smaller breakpoints. All primary page content lives here.
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>Single pane: one main content region</li>
              <li>Pane area can be 2 or even 4 panes: e.g. list | detail, or a 2×2 grid</li>
              <li>Panes can have internal scroll; app bar and optional side panels stay fixed</li>
              <li>Responsive: panes stack or simplify on narrow viewports</li>
            </ul>
          </section>

          {/* Control panel */}
          <section className="mb-16 border-t border-border pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Control panel
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              The control panel is an optional right-hand panel. It holds
              context-specific controls, filters, settings, or properties
              related to the content in the Pane. It can be collapsible or
              hidden on smaller screens and shown from a trigger (e.g. filter
              icon) when needed. Use it to keep the main pane focused while
              still offering secondary controls.
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>Right side; fixed or sticky height</li>
              <li>Filters, sort, view options, or property editors</li>
              <li>Can be toggled open/closed; optional overlay on small screens</li>
              <li>Width can be fixed (e.g. 288px) or resizable within a range</li>
            </ul>
          </section>

        </div>
      </div>
    </>
  );
}
