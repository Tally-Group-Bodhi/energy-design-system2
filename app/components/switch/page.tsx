"use client";

import Switch from "@/components/Switch/Switch";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function SwitchPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [checked, setChecked] = useState(false);

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Switch" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Switch components allow users to toggle between two states. They
              provide clear visual feedback for on/off states.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Basic Switch
                </h2>
                <div className="space-y-4">
                  <Switch
                    label="Enable notifications"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  <Switch label="Dark mode" defaultChecked />
                  <Switch label="Disabled switch" disabled />
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  With Helper Text
                </h2>
                <div className="space-y-4">
                  <Switch
                    label="Email notifications"
                    helperText="Receive email updates about your account"
                    defaultChecked
                  />
                </div>
              </section>
            </>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage Examples
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import Switch from "@/components/Switch/Switch";

<Switch label="Enable notifications" />
<Switch label="Dark mode" defaultChecked />`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

