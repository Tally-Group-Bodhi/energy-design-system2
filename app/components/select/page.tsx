"use client";

import Select from "@/components/Select/Select";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function SelectPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Select" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Select components allow users to choose from a list of options.
              They provide a compact way to display multiple choices.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Basic Select
                </h2>
                <div className="max-w-md space-y-4">
                  <Select placeholder="Select an option...">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                  <Select label="Choose a country" placeholder="Select country...">
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                  </Select>
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  States
                </h2>
                <div className="max-w-md space-y-4">
                  <Select label="Disabled" disabled>
                    <option>Option 1</option>
                  </Select>
                  <Select label="Error" error helperText="This field is required">
                    <option>Option 1</option>
                  </Select>
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
                <code>{`import Select from "@/components/Select/Select";

<Select placeholder="Select an option...">
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</Select>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

