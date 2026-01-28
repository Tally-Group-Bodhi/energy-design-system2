"use client";

import Checkbox from "@/components/Checkbox/Checkbox";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function CheckboxPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Checkbox" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Checkboxes allow users to select one or more options from a list.
              They provide clear visual feedback for selection states.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Basic Checkbox
                </h2>
                <div className="space-y-4">
                  <Checkbox label="Accept terms and conditions" />
                  <Checkbox label="Subscribe to newsletter" defaultChecked />
                  <Checkbox label="Disabled checkbox" disabled />
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  With Helper Text
                </h2>
                <div className="space-y-4">
                  <Checkbox
                    label="Enable notifications"
                    helperText="Receive email notifications about your account"
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
                <code>{`import Checkbox from "@/components/Checkbox/Checkbox";

<Checkbox label="Accept terms" />
<Checkbox label="Subscribe" defaultChecked />
<Checkbox label="Enable notifications" helperText="Helpful text" />`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

