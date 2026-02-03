"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/Tabs/Tabs";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function TabsPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Tabs" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Tabs organise content into switchable panels. They use our
              primary colour for the active state and borders.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-border pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Basic tabs
                </h2>
                <Tabs defaultValue="overview" className="max-w-2xl">
                  <TabsList className="grid w-full grid-cols-3 rounded-lg bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-200">
                    <TabsTrigger
                      value="overview"
                      className="flex items-center justify-center gap-2 rounded-md px-2 py-1 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
                    >
                      <Icon name="dashboard" size={18} />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="details"
                      className="flex items-center justify-center gap-2 rounded-md px-2 py-1 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
                    >
                      <Icon name="info" size={18} />
                      Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="flex items-center justify-center gap-2 rounded-md px-2 py-1 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
                    >
                      <Icon name="settings" size={18} />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-4 rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                      Overview content. Uses our Energy design system colours
                      and foundations.
                    </p>
                  </TabsContent>
                  <TabsContent value="details" className="mt-4 rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                      Details content. Icons from Material Symbols.
                    </p>
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4 rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                      Settings content.
                    </p>
                  </TabsContent>
                </Tabs>
              </section>

              <section className="mb-16 border-t border-border pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Dark mode tab styling
                </h2>
                <p className="mb-4 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
                  In dark mode, tabs use lighter inactive labels for readability{" "}
                  (<code>dark:text-gray-200</code>) and a higher-contrast active pill with{" "}
                  <code>dark:bg-gray-900</code> and <code>dark:text-gray-100</code>. Apply this pattern
                  to all page-level and in-panel tab sets.
                </p>
                <Tabs defaultValue="tab-1" className="max-w-xl">
                  <TabsList className="inline-flex h-10 items-center justify-start gap-1 rounded-lg bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-200">
                    <TabsTrigger
                      value="tab-1"
                      className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab-2"
                      className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
                    >
                      Activity
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab-3"
                      className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
                    >
                      Settings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab-1" className="mt-4 rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                      Example of tab styling used on pages like Tally Acquire and Tally Large Market.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab-2" className="mt-4 rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Activity content placeholder.</p>
                  </TabsContent>
                  <TabsContent value="tab-3" className="mt-4 rounded-lg border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Settings content placeholder.</p>
                  </TabsContent>
                </Tabs>
              </section>
            </>
          )}

          {activeTab === "code" && (
            <section className="border-t border-border pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import { Icon } from "@/components/ui/icon";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1"><Icon name="dashboard" /> Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
