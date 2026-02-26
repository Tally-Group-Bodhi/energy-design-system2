"use client";

import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

const iconSizes = [
  {
    size: 16,
    label: "16px",
    token: "size={16}",
    usage: "Inline with small text, badges, compact UI, dense tables",
  },
  {
    size: 20,
    label: "20px",
    token: "size={20}",
    usage: "Default for buttons, inputs, navigation items, most UI elements",
  },
  {
    size: 24,
    label: "24px",
    token: "size={24}",
    usage: "Standalone icons, empty states, prominent actions, page headers",
  },
];

const iconCategories = [
  {
    title: "Actions",
    description: "Common actions: add, edit, delete, save, search.",
    icons: [
      "add",
      "remove",
      "edit",
      "delete",
      "save",
      "search",
      "refresh",
      "download",
      "upload",
      "share",
      "content_copy",
      "content_cut",
      "check",
      "close",
    ],
  },
  {
    title: "Navigation",
    description: "Wayfinding and movement.",
    icons: [
      "home",
      "menu",
      "arrow_back",
      "arrow_forward",
      "expand_more",
      "expand_less",
      "chevron_left",
      "chevron_right",
      "open_in_new",
      "subdirectory_arrow_right",
    ],
  },
  {
    title: "Content & file",
    description: "Documents, media, and content types.",
    icons: [
      "description",
      "folder",
      "image",
      "video_file",
      "audio_file",
      "article",
      "draft",
      "attach_file",
      "link",
      "insert_drive_file",
    ],
  },
  {
    title: "Communication & feedback",
    description: "Status, alerts, and messaging.",
    icons: [
      "mail",
      "send",
      "notifications",
      "info",
      "warning",
      "error",
      "check_circle",
      "cancel",
      "help",
      "feedback",
    ],
  },
  {
    title: "User & settings",
    description: "Account, preferences, and system.",
    icons: [
      "person",
      "settings",
      "logout",
      "login",
      "lock",
      "visibility",
      "visibility_off",
      "admin_panel_settings",
      "manage_accounts",
    ],
  },
  {
    title: "UI & layout",
    description: "Layout and display controls.",
    icons: [
      "dashboard",
      "widgets",
      "tune",
      "filter_list",
      "sort",
      "view_list",
      "view_module",
      "fullscreen",
      "more_vert",
      "more_horiz",
    ],
  },
];

function IconCard({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-md border border-border bg-card px-2 py-2.5 transition-colors hover:border-primary/40 hover:bg-muted/40">
      <Icon name={name} size={20} className="text-foreground" />
      <span className="max-w-full truncate text-center text-[10px] font-mono text-muted-foreground leading-tight">
        {name}
      </span>
    </div>
  );
}

export default function IconsPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Icons" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              We use Google Material Symbols (Outlined) as our foundational
              icon set. Icons use our foreground and primary colours for
              consistency with the Energy design system.
            </p>
          </div>

          {activeTab === "design" && (
            <div className="space-y-14">
              {/* Sizing rules */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Sizing
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  Three standard sizes cover all use cases. Always use one of
                  these — never arbitrary values. The default is 20px.
                </p>

                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="w-[100px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Size
                        </th>
                        <th className="w-[80px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Preview
                        </th>
                        <th className="w-[140px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Prop
                        </th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          When to use
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {iconSizes.map((s) => (
                        <tr
                          key={s.size}
                          className="border-b border-border last:border-b-0"
                        >
                          <td className="px-4 py-3 font-mono text-sm text-gray-900">
                            {s.label}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Icon
                                name="home"
                                size={s.size}
                                className="text-foreground"
                              />
                              <Icon
                                name="search"
                                size={s.size}
                                className="text-foreground"
                              />
                              <Icon
                                name="settings"
                                size={s.size}
                                className="text-foreground"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600">
                            {s.token}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {s.usage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Contextual examples */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  In context
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  Icons should match the visual weight of their surrounding
                  text and controls. Here are common pairings.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Button example */}
                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Button (20px)
                    </p>
                    <button className="inline-flex items-center gap-1.5 rounded-md bg-[#2C365D] px-3 py-1.5 text-sm font-medium text-white">
                      <Icon name="add" size={18} className="text-white" />
                      Add item
                    </button>
                  </div>

                  {/* Nav item example */}
                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Navigation item (20px)
                    </p>
                    <div className="flex items-center gap-2.5 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900">
                      <Icon name="dashboard" size={20} className="text-gray-600" />
                      Dashboard
                    </div>
                  </div>

                  {/* Inline text example */}
                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Inline with text (16px)
                    </p>
                    <p className="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="info" size={16} className="text-gray-400" />
                      Updated 3 minutes ago
                    </p>
                  </div>

                  {/* Input example */}
                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Input prefix (20px)
                    </p>
                    <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5">
                      <Icon name="search" size={20} className="text-gray-400" />
                      <span className="text-sm text-gray-400">Search…</span>
                    </div>
                  </div>

                  {/* Badge example */}
                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Badge / tag (16px)
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      <Icon name="check_circle" size={14} className="text-green-600" />
                      Active
                    </span>
                  </div>

                  {/* Icon button example */}
                  <div className="rounded-lg border border-border bg-white p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Icon button (20px)
                    </p>
                    <div className="flex items-center gap-1">
                      <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
                        <Icon name="edit" size={20} />
                      </button>
                      <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
                        <Icon name="delete" size={20} />
                      </button>
                      <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
                        <Icon name="more_vert" size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Spacing & alignment */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Spacing & alignment
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  Follow these rules for consistent icon placement across the system.
                </p>

                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Rule
                        </th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Detail
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Icon + label gap
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Use <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">gap-1.5</code> (6px) for buttons and nav items,{" "}
                          <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">gap-1</code> (4px) for inline/small text.
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Vertical alignment
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Always use <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">items-center</code> with flexbox — icons are already optically centred.
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Touch target
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Standalone icon buttons must have at least 32×32px hit area. Use <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">p-1.5</code> around a 20px icon.
                        </td>
                      </tr>
                      <tr className="border-b border-border last:border-b-0">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          Colour
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Use <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">text-foreground</code> for primary actions,{" "}
                          <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">text-muted-foreground</code> for secondary, and semantic colours for status.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Icon library */}
              {iconCategories.map((category) => (
                <section
                  key={category.title}
                  className="border-t border-border pt-10"
                >
                  <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                    {category.title}
                  </h2>
                  <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                    {category.description}
                  </p>
                  <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12">
                    {category.icons.map((name) => (
                      <IconCard key={name} name={name} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {activeTab === "code" && (
            <section className="space-y-10 border-t border-border pt-10">
              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Import
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`import { Icon } from "@/components/ui/icon";`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Sizes
                </h2>
                <p className="mb-4 max-w-3xl text-sm leading-6 text-gray-600">
                  Always use one of the three standard sizes. The default is 24px
                  but we recommend explicitly setting 20px for most UI contexts.
                </p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`// 16px — inline text, badges, dense tables
<Icon name="info" size={16} />

// 20px — buttons, inputs, nav items (most common)
<Icon name="home" size={20} />

// 24px — standalone, empty states, page headers
<Icon name="add" size={24} />`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  With a button
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`import { Icon } from "@/components/ui/icon";
import Button from "@/components/Button/Button";

<Button variant="primary">
  <Icon name="add" size={18} className="mr-1.5" />
  Add item
</Button>`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Icon button
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`<button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
  <Icon name="edit" size={20} />
</button>`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Colour
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`// Primary (default)
<Icon name="home" size={20} className="text-foreground" />

// Muted / secondary
<Icon name="info" size={16} className="text-muted-foreground" />

// Semantic status
<Icon name="check_circle" size={20} className="text-green-600" />
<Icon name="warning" size={20} className="text-amber-500" />
<Icon name="error" size={20} className="text-red-600" />`}</code>
                </pre>
              </div>

              <div>
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Reference
                </h2>
                <p className="text-sm text-gray-600">
                  Browse all symbols at{" "}
                  <a
                    href="https://fonts.google.com/icons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline hover:no-underline"
                  >
                    fonts.google.com/icons
                  </a>
                  . Use the exact snake_case name shown there (e.g.{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">
                    expand_more
                  </code>
                  ,{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-gray-700">
                    check_circle
                  </code>
                  ).
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
