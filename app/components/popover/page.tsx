"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/Popover/Popover";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function PopoverPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Popover" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Popovers display extra content on demand. They use our card,
              border, and primary colours.
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Basic popover
              </h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Icon name="help" size={18} className="mr-2" />
                    Show info
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      Popover title
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      This popover uses our Energy design system colours and
                      foundations. Content can include icons from Material Symbols.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </section>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import { Popover, PopoverTrigger, PopoverContent } from "@/components/Popover/Popover";
import Button from "@/components/Button/Button";

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Content here.</p>
  </PopoverContent>
</Popover>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
