"use client";

import Toggle from "@/components/Toggle/Toggle";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function TogglePage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Toggle" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Toggles switch between on and off. They use our primary
              colour (#2C365D) when pressed; icons from Material Symbols.
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Basic toggle
              </h2>
              <div className="flex flex-wrap gap-4">
                <Toggle>
                  <Icon name="format_bold" size={18} className="mr-2" />
                  Bold
                </Toggle>
                <Toggle>
                  <Icon name="format_italic" size={18} className="mr-2" />
                  Italic
                </Toggle>
                <Toggle>
                  <Icon name="format_underlined" size={18} className="mr-2" />
                  Underline
                </Toggle>
                <Toggle>
                  <Icon name="link" size={18} className="mr-2" />
                  Link
                </Toggle>
              </div>
            </section>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import Toggle from "@/components/Toggle/Toggle";
import { Icon } from "@/components/ui/icon";

<Toggle>
  <Icon name="format_bold" size={18} /> Bold
</Toggle>
<Toggle pressed={pressed} onPressedChange={setPressed}>
  <Icon name="link" /> Link
</Toggle>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
