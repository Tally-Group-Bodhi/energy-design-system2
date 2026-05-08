"use client";

import { useState } from "react";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { Icon } from "@/components/ui/icon";

const ATOMIC_LEVELS = [
  {
    name: "Atoms",
    icon: "circle",
    color: "#00D2A2",
    description:
      "The smallest, indivisible UI elements. They can't be broken down further without losing meaning.",
    tdsExamples: [
      "Button",
      "Input",
      "Label",
      "Badge",
      "Icon",
      "Checkbox",
      "Switch",
      "Avatar",
      "Separator",
      "Skeleton",
    ],
    detail:
      "In the TDS, atoms are primitive components that serve a single purpose. A Button triggers an action. An Input captures text. A Badge shows a status. These are the fundamental building blocks every other component is composed from.",
  },
  {
    name: "Molecules",
    icon: "hub",
    color: "#2C365D",
    description:
      "Small groups of atoms bonded together to form a functional unit. They do one thing well.",
    tdsExamples: [
      "Select (Label + Input + Dropdown)",
      "RadioGroup (Label + Radio buttons)",
      "Tooltip (Trigger + Popover)",
      "Breadcrumb (Links + Separators)",
      "Toast (Icon + Message + Action)",
      "ButtonGroup (multiple Buttons)",
    ],
    detail:
      "Molecules combine atoms into reusable, purposeful groups. A Select molecule combines a Label, an Input trigger, and a dropdown list. A Breadcrumb is a series of linked text items separated by icons. Each molecule has a clear, single responsibility.",
  },
  {
    name: "Organisms",
    icon: "dashboard",
    color: "#7C3AED",
    description:
      "Complex UI sections made of molecules and atoms. They form distinct areas of the interface.",
    tdsExamples: [
      "NavigationBar (Logo + Nav items + Collapse toggle)",
      "Table (Headers + Rows + Cells + Sorting)",
      "Dialog (Overlay + Card + Actions)",
      "Sheet (Overlay + Slide panel + Content)",
      "Account Context Panel",
      "Chart Widgets",
      "App Bar (Logo + Search + Avatar)",
    ],
    detail:
      "Organisms are where the interface starts to take shape. The NavigationBar organism combines a logo, a list of navigation items, collapse/expand behaviour, and active-state theming. A Table organism provides sorting, rows, headers, and pagination. These are the building blocks of page layouts.",
  },
  {
    name: "Templates",
    icon: "grid_view",
    color: "#C53B00",
    description:
      "Page-level layouts that define the content structure. They focus on arrangement, not content.",
    tdsExamples: [
      "Login layout",
      "Dashboard layout (KPI cards + Charts + Tables)",
      "Kanban board layout (Columns + Cards)",
      "Form layout (Sections + Fields + Actions)",
    ],
    detail:
      "Templates define how organisms are arranged on a page: where the navigation sits, how the main content area is divided, and how control panels attach. Login, Dashboard, and Forms are structural templates — skeletons that can be filled with any product's content.",
  },
  {
    name: "Pages",
    icon: "web",
    color: "#0074C4",
    description:
      "Specific instances of templates with real content, brand tokens, and product behaviour.",
    tdsExamples: [
      "Tally Glass (call centre agent view)",
      "Tally CRM Dashboard",
      "Tally CRM Pipeline (Kanban)",
      "Tally+ Large Market",
      "Tally Orion",
      "Tally Acquire",
    ],
    detail:
      "Pages are templates brought to life with real data, brand tokens, and product-specific behaviour. The Tally CRM Pipeline page is a Kanban template populated with opportunity data, branded with CRM active colours, and wired to drag-and-drop interactions. Each Tally product is a different page instance of shared templates.",
  },
];

const TDS_LAYERS = [
  {
    name: "Foundation",
    icon: "palette",
    color: "#595767",
    atomicMapping: "Design Tokens (sub-atomic)",
    description: "Foundation-level tokens and system-wide settings that atoms are built from.",
    items: [
      "Colours",
      "Typography",
      "Icons",
      "Layout",
      "Layout Grid",
      "Surface Colour",
      "Panes",
      "Density",
      "Dark Mode",
      "Logo",
      "Cursor Rules",
    ],
  },
  {
    name: "Atoms",
    icon: "deployed_code",
    color: "#00D2A2",
    atomicMapping: "Atoms",
    description:
      "Individual, indivisible UI elements — each does one thing. These cannot be broken down further without losing meaning.",
    items: [
      "Alert",
      "Aspect Ratio",
      "Avatar",
      "Badge",
      "Button",
      "Checkbox",
      "Input",
      "Progress",
      "Skeleton",
      "Slider",
      "Switch",
      "Textarea",
      "Toggle",
      "Tooltip",
    ],
  },
  {
    name: "Molecules",
    icon: "hub",
    color: "#2C365D",
    atomicMapping: "Molecules",
    description:
      "Small groups of atoms bonded together into a functional unit. Each molecule does one thing well.",
    items: [
      "Accordion",
      "Alert Dialog",
      "Breadcrumb",
      "Button Group",
      "Calendar",
      "Collapsible",
      "Dropdown Menu",
      "Popover",
      "Radio Group",
      "Select",
      "Tabs",
      "Toast",
      "Toggle Group",
    ],
  },
  {
    name: "Organisms",
    icon: "widgets",
    color: "#7C3AED",
    atomicMapping: "Organisms",
    description:
      "Complex, multi-part UI sections that form distinct areas of the interface. They combine molecules and atoms into standalone blocks.",
    items: [
      "Account Context Panel",
      "App Bar",
      "Card",
      "Charts",
      "Chart Widgets",
      "Dialog",
      "Navigation Bar",
      "Sheet",
      "Table",
    ],
  },
  {
    name: "Templates",
    icon: "grid_view",
    color: "#C53B00",
    atomicMapping: "Templates",
    description:
      "Page-level structural layouts that define content arrangement. They focus on the skeleton, not the content.",
    items: [
      "Login",
      "Dashboard",
      "Forms",
    ],
  },
  {
    name: "Pages",
    icon: "newsmode",
    color: "#0074C4",
    atomicMapping: "Pages",
    description:
      "Specific instances of templates brought to life with real content, brand tokens, and product-specific behaviour.",
    items: [
      "Tally+ Small Market",
      "Tally+ Large Market",
      "Glass Vision",
      "Tally Orion",
      "Tally Acquire",
      "Beta Test Dashboard",
      "S&A Beta",
      "Tally CRM",
    ],
  },
];

const DESIGN_DECISIONS = [
  {
    icon: "call_split",
    title: "Molecules are separated from Organisms",
    description:
      "Simple composed groups (Breadcrumb, Toast, Popover, Select) live in Molecules, while complex multi-part sections (Navigation Bar, Table, Card, Charts) live in Organisms. This makes it clear at a glance whether something is a lightweight composition or a substantial section of UI.",
  },
  {
    icon: "layers",
    title: "Templates are structural, Pages are branded",
    description:
      "Templates (Login, Dashboard, Forms) define reusable layout skeletons — the structural arrangement of organisms on a page. Pages (Tally CRM, Tally Glass, Tally Orion) are specific instances of those templates filled with real data, brand tokens, and product behaviour.",
  },
  {
    icon: "deployed_code",
    title: "Atoms are truly atomic",
    description:
      "The Atoms section only contains indivisible elements — Button, Input, Checkbox, Badge. Items that internally compose multiple atoms (like Select, Accordion, Radio Group) are correctly placed in Molecules.",
  },
  {
    icon: "palette",
    title: "Foundation serves as the sub-atomic layer",
    description:
      "Atomic design has an implied \"design tokens\" layer beneath atoms. The TDS captures this in the Foundation section — colours, typography, icons, density, and other foundational settings that atoms are built from.",
  },
];

function AtomicLevelCard({
  level,
  index,
}: {
  level: (typeof ATOMIC_LEVELS)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group relative rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${level.color}15` }}
        >
          <Icon name={level.icon} size={24} style={{ color: level.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: level.color }}
            >
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {level.name}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {level.description}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          TDS Examples
        </p>
        <div className="flex flex-wrap gap-1.5">
          {level.tdsExamples.map((example) => (
            <span
              key={example}
              className="inline-flex rounded-md border border-border px-2 py-0.5 text-xs font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              {example}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-sm font-medium text-[#2C365D] transition-colors hover:text-[#2C365D]/80 dark:text-[#80B3FF] dark:hover:text-[#80B3FF]/80"
      >
        <Icon name={expanded ? "expand_less" : "expand_more"} size={18} />
        {expanded ? "Show less" : "How this applies to TDS"}
      </button>

      {expanded && (
        <div className="mt-3 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
          {level.detail}
        </div>
      )}
    </div>
  );
}

function MappingDiagram() {
  const mappings: {
    tds: (typeof TDS_LAYERS)[number];
    atomic: string[];
    arrow: string;
  }[] = [
    {
      tds: TDS_LAYERS[0],
      atomic: ["Design Tokens"],
      arrow: "Sub-atomic foundation",
    },
    {
      tds: TDS_LAYERS[1],
      atomic: ["Atoms"],
      arrow: "1:1 match",
    },
    {
      tds: TDS_LAYERS[2],
      atomic: ["Molecules"],
      arrow: "1:1 match",
    },
    {
      tds: TDS_LAYERS[3],
      atomic: ["Organisms"],
      arrow: "1:1 match",
    },
    {
      tds: TDS_LAYERS[4],
      atomic: ["Templates"],
      arrow: "1:1 match",
    },
    {
      tds: TDS_LAYERS[5],
      atomic: ["Pages"],
      arrow: "1:1 match",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-border bg-gray-50/80 px-6 py-3 dark:border-gray-700 dark:bg-gray-700/50">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          TDS Sidebar → Atomic Design Mapping
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border dark:border-gray-700">
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                TDS Sidebar Layer
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Relationship
              </th>
              <th className="px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Atomic Design Level(s)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-gray-700">
            {mappings.map((m) => (
              <tr key={m.tds.name}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${m.tds.color}15` }}
                    >
                      <Icon
                        name={m.tds.icon}
                        size={18}
                        style={{ color: m.tds.color }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {m.tds.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <Icon
                      name="arrow_forward"
                      size={16}
                      className="text-gray-400"
                    />
                    <span
                      className={`text-[10px] font-medium ${
                        m.arrow === "1:1 match"
                          ? "text-green-600 dark:text-green-400"
                          : m.arrow === "Sub-atomic foundation"
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {m.arrow}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {m.atomic.map((a) => {
                      const atomicColors: Record<string, string> = {
                        "Design Tokens": "#595767",
                        Atoms: "#00D2A2",
                        Molecules: "#2C365D",
                        Organisms: "#7C3AED",
                        Templates: "#C53B00",
                        Pages: "#0074C4",
                      };
                      const c = atomicColors[a] || "#595767";
                      return (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${c}15`,
                            color: c,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: c }}
                          />
                          {a}
                        </span>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TdsLayerCard({ layer }: { layer: (typeof TDS_LAYERS)[number] }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${layer.color}15` }}
        >
          <Icon name={layer.icon} size={20} style={{ color: layer.color }} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {layer.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Maps to:{" "}
            <span className="font-medium" style={{ color: layer.color }}>
              {layer.atomicMapping}
            </span>
          </p>
        </div>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {layer.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {layer.items.map((item) => (
          <span
            key={item}
            className="inline-flex rounded-md border border-border px-2 py-0.5 text-xs text-gray-600 dark:border-gray-600 dark:text-gray-400"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function HierarchyDiagram() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-border bg-gray-50/80 px-6 py-3 dark:border-gray-700 dark:bg-gray-700/50">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Atomic Design Hierarchy
        </p>
      </div>
      <div className="flex flex-col items-center gap-0 py-8 px-6">
        {ATOMIC_LEVELS.map((level, i) => (
          <div key={level.name} className="flex flex-col items-center">
            {i > 0 && (
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            )}
            <div
              className="flex items-center gap-3 rounded-lg border-2 px-5 py-3 transition-colors"
              style={{
                borderColor: level.color,
                backgroundColor: `${level.color}08`,
              }}
            >
              <Icon
                name={level.icon}
                size={20}
                style={{ color: level.color }}
              />
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: level.color }}
                >
                  {level.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {i === 0 && "Button, Input, Badge, Icon…"}
                  {i === 1 && "Select, Breadcrumb, RadioGroup…"}
                  {i === 2 && "NavigationBar, Table, Dialog, Charts…"}
                  {i === 3 && "Dashboard layout, Kanban layout…"}
                  {i === 4 && "Tally CRM, Tally Glass, Orion…"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesignTab() {
  return (
    <div className="space-y-16">
      {/* Intro */}
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          What is Atomic Design?
        </h2>
        <p className="mb-4 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Atomic Design is a methodology created by Brad Frost that breaks user
          interfaces into five hierarchical levels:{" "}
          <strong className="text-gray-800 dark:text-gray-200">
            Atoms, Molecules, Organisms, Templates,
          </strong>{" "}
          and{" "}
          <strong className="text-gray-800 dark:text-gray-200">Pages</strong>.
          Instead of designing entire screens at once, you build a system of
          reusable parts that compose into increasingly complex structures.
        </p>
        <p className="max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          This approach gives us consistency across all Tally products. Whether
          we&apos;re building a call centre tool (Tally Glass), a CRM, or a
          customer dashboard, the same atoms and molecules are reused —
          guaranteeing visual and behavioural coherence.
        </p>
      </section>

      {/* Hierarchy Diagram */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          The Five Levels
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Each level builds on the one below. Complexity increases as you move
          up, but each layer remains independently testable and reusable.
        </p>
        <HierarchyDiagram />
      </section>

      {/* Levels breakdown */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Levels in Detail
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Here&apos;s how each atomic level maps to components and patterns in
          the Tally Design System.
        </p>
        <div className="grid gap-6">
          {ATOMIC_LEVELS.map((level, i) => (
            <AtomicLevelCard key={level.name} level={level} index={i} />
          ))}
        </div>
      </section>

      {/* TDS ↔ Atomic mapping */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          How the TDS Sidebar Maps to Atomic Design
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          The TDS sidebar has six layers (disregarding Brands), each mapping
          directly to an atomic design level.
        </p>
        <MappingDiagram />
      </section>

      {/* TDS layers detail */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          TDS Layers in Detail
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Each sidebar section and what it contains:
        </p>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TDS_LAYERS.map((layer) => (
            <TdsLayerCard key={layer.name} layer={layer} />
          ))}
        </div>
      </section>

      {/* Design Decisions */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Design Decisions
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          The TDS sidebar is structured to match atomic design levels. Here are
          the key decisions behind the mapping.
        </p>

        <div className="space-y-4">
          {DESIGN_DECISIONS.map((decision) => (
            <div
              key={decision.title}
              className="rounded-xl border border-green-200 bg-green-50/50 p-5 dark:border-green-800/50 dark:bg-green-900/10"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Icon
                    name={decision.icon}
                    size={18}
                    className="text-green-700 dark:text-green-400"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {decision.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {decision.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Design System Principles
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          These principles guide how we build and evolve the TDS. They ensure
          atomic design stays practical, not just theoretical.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              icon: "search",
              title: "Check before creating",
              body: "Always search for existing components first. The sidebar lists every available component. Only create something new when nothing existing will work.",
            },
            {
              icon: "layers",
              title: "Compose, don't duplicate",
              body: "Build complex UI by composing simpler components. A form field is a Label + Input + helper text — not a new monolithic component.",
            },
            {
              icon: "palette",
              title: "Tokens over hardcoded values",
              body: "Use design tokens for colours, spacing, and typography. This ensures consistency across products and makes theming possible.",
            },
            {
              icon: "tune",
              title: "Props over forks",
              body: "When a component needs variation, add a prop (size, variant, brand). Don't copy-paste and modify a component for one product.",
            },
            {
              icon: "devices",
              title: "Density-aware",
              body: "Components respond to the density system. Spacing, type sizes, and radii adjust automatically based on viewport width.",
            },
            {
              icon: "brand_awareness",
              title: "Brand-flexible",
              body: "Components accept brand tokens (active colours, surface gradients) so one component can serve Tally CRM, Tally Glass, and every other product.",
            },
          ].map((principle) => (
            <div
              key={principle.title}
              className="rounded-xl border border-border bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2C365D]/10 dark:bg-[#2C365D]/30">
                  <Icon
                    name={principle.icon}
                    size={18}
                    className="text-[#2C365D] dark:text-[#80B3FF]"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {principle.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="border-t border-border pt-16 pb-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Building with the TDS
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          When adding a new feature or page, follow this atomic workflow:
        </p>

        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Start with Foundation",
              body: "Identify the colours, typography, and spacing you need. Check the Foundation section for tokens and foundation settings.",
            },
            {
              step: "2",
              title: "Find existing Atoms",
              body: "Browse the Atoms section in the sidebar. Most UI needs are already covered by Button, Input, Badge, and others.",
            },
            {
              step: "3",
              title: "Compose with Molecules and Organisms",
              body: "Assemble atoms into molecules (Select, Tabs, Accordion) and organisms (Card, Table, Navigation Bar, Dialog) for your page.",
            },
            {
              step: "4",
              title: "Apply a Template",
              body: "Use an existing layout from the Templates section (Dashboard, Login, Forms) or create a new one if no pattern fits.",
            },
            {
              step: "5",
              title: "Brand and ship",
              body: "Apply the product's brand tokens (activeColors, surface colour) and populate with real data. The page is complete.",
            },
          ].map((step) => (
            <div
              key={step.step}
              className="flex gap-4 rounded-lg border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2C365D] text-sm font-bold text-white">
                {step.step}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {step.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function TdsSetupPage() {
  const [activeTab, setActiveTab] = useState("design");
  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="How the TDS is Set Up" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              The Tally Design System (TDS) is built on{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                Atomic Design
              </strong>{" "}
              principles — a methodology that organises UI into five
              hierarchical levels, from foundational tokens up to complete
              product pages. This page explains the theory, how the TDS sidebar
              maps to it, and where the gaps are.
            </p>
          </div>

          {activeTab === "design" && <DesignTab />}
          {activeTab === "code" && (
            <div className="space-y-16">
              <section>
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  File Structure
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
                  The codebase is structured to follow atomic design. Here is
                  the key directory layout:
                </p>
                <div className="overflow-hidden rounded-xl border border-border bg-gray-900 dark:border-gray-700">
                  <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-gray-300">
                    <code>{`├── lib/
│   ├── tokens/              # Foundation (sub-atomic)
│   │   ├── colors.ts        # Colour palette & semantic colours
│   │   └── surface-colours.ts  # Brand surface gradients
│   ├── density.ts           # Density system (spacing, type, radius)
│   └── mock-data/           # Sample data for pages
│
├── components/
│   ├── ui/                  # Atoms: icon, badge primitives
│   ├── Button/              # Atoms: Button, Input, Toggle…
│   ├── Select/              # Molecules: Select, Accordion, Tabs…
│   ├── Card/                # Organisms: Card (Header + Content + Footer)
│   ├── NavigationBar/       # Organisms: full navigation bar
│   ├── Sidebar/             # Organisms: app sidebar
│   └── crm/                 # Organisms: PipelineColumn, OpportunityCard
│
├── app/
│   ├── foundation/          # Foundation + Brands documentation
│   ├── components/          # Component, Molecule & Organism docs
│   ├── pages/               # Templates + Pages
│   └── crm/                 # Tally CRM (page instance)`}</code>
                  </pre>
                </div>
              </section>

              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Importing by Layer
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
                  All design system components use the{" "}
                  <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    @/
                  </code>{" "}
                  path alias. Imports grouped by TDS layer:
                </p>
                <div className="overflow-hidden rounded-xl border border-border bg-gray-900 dark:border-gray-700">
                  <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-gray-300">
                    <code>{`// ── Foundation (design tokens) ──────────────────────
import { colors } from "@/lib/tokens/colors";
import { surfaceColours } from "@/lib/tokens/surface-colours";

// ── Atoms ────────────────────────────────────────
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import Badge from "@/components/Badge/Badge";
import Input from "@/components/Input/Input";

// ── Molecules ────────────────────────────────────
import { Select } from "@/components/Select/Select";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { Tabs } from "@/components/Tabs/Tabs";
import { Accordion } from "@/components/Accordion/Accordion";

// ── Organisms ────────────────────────────────────
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { Card, CardHeader, CardContent } from "@/components/Card/Card";
import { Table } from "@/components/Table/Table";
import { Dialog } from "@/components/Dialog/Dialog";

// ── Templates + Pages ────────────────────────────
// See app/pages/ for layout templates
// See app/crm/ for Tally CRM page instances`}</code>
                  </pre>
                </div>
              </section>

              <section className="border-t border-border pt-16 pb-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Creating a New Component
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
                  If you must create a new component (after verifying nothing
                  existing works), follow this structure:
                </p>
                <div className="overflow-hidden rounded-xl border border-border bg-gray-900 dark:border-gray-700">
                  <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-gray-300">
                    <code>{`// 1. Create the component file
//    components/MyComponent/MyComponent.tsx

// 2. Create the documentation page
//    app/components/my-component/page.tsx

// 3. Add to the sidebar navigation in app/layout.tsx
//    → "Atoms" if it's single-purpose and indivisible
//    → "Molecules" if it composes 2-3 atoms into a unit
//    → "Organisms" if it's a complex, multi-part section

// 4. Follow atomic principles:
//    - Compose from existing atoms/molecules where possible
//    - Accept brand tokens via props (not hardcoded)
//    - Support density system via CSS custom properties
//    - Support dark mode with dark: variants`}</code>
                  </pre>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
