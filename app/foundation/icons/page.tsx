"use client";

import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

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
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-muted/50">
      <Icon name={name} size={32} className="text-foreground" />
      <span className="mt-2 max-w-full truncate text-center text-xs font-mono text-muted-foreground">
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
            <div className="space-y-16">
              {iconCategories.map((category) => (
                <section
                  key={category.title}
                  className="border-t border-gray-200 pt-16"
                >
                  <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                    {category.title}
                  </h2>
                  <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                    {category.description}
                  </p>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                    {category.icons.map((name) => (
                      <IconCard key={name} name={name} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <p className="mb-4 max-w-3xl text-base leading-6 text-gray-600">
                Import the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">Icon</code> component
                and pass the Material Symbol name as the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">name</code> prop.
                Names use snake_case (e.g. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">expand_more</code>, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">check_circle</code>).
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Basic
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`import { Icon } from "@/components/ui/icon";

<Icon name="home" />
<Icon name="settings" size={20} />
<Icon name="add" size={32} className="text-primary" />`}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    With button
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`import { Icon } from "@/components/ui/icon";
import Button from "@/components/Button/Button";

<Button variant="primary">
  <Icon name="add" size={18} className="mr-2" />
  Add item
</Button>`}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Reference
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    Browse all symbols at{" "}
                    <a
                      href="https://fonts.google.com/icons"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline hover:no-underline"
                    >
                      fonts.google.com/icons
                    </a>
                    . Use the exact name shown there (e.g. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">expand_more</code>).
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
