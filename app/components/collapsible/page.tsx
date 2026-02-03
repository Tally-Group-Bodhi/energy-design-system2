"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/Collapsible/Collapsible";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function CollapsiblePage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Collapsible" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Collapsible sections show or hide content. Uses our primary
              colour for focus and borders; icons from Material Symbols.
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Basic collapsible
              </h2>
              <div className="max-w-2xl rounded-lg border border-border bg-card p-4">
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <span className="flex items-center gap-2">
                      <Icon name="info" size={20} />
                      More information
                    </span>
                    <Icon name="expand_more" size={20} className="transition-transform [[data-state=open]_&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-2 pt-1 text-sm text-muted-foreground">
                    This content can be expanded or collapsed. It uses our
                    design tokens for background, border, and text colours.
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </section>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import {
  Collapsible, CollapsibleTrigger, CollapsibleContent,
} from "@/components/Collapsible/Collapsible";
import { Icon } from "@/components/ui/icon";

<Collapsible defaultOpen={false}>
  <CollapsibleTrigger className="...">
    <Icon name="expand_more" /> Toggle
  </CollapsibleTrigger>
  <CollapsibleContent>
    Content here.
  </CollapsibleContent>
</Collapsible>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
