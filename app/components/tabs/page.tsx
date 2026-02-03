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
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Tabs organise content into switchable panels. They use our
              primary colour for the active state and borders.
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Basic tabs
              </h2>
              <Tabs defaultValue="overview" className="max-w-2xl">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Icon name="dashboard" size={18} />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <Icon name="info" size={18} />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
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
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
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
