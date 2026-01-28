"use client";

import Input from "@/components/Input/Input";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function InputPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Input" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Input components allow users to enter and edit text. They provide
              clear visual feedback and support various states and validation
              scenarios.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Basic Input
                </h2>
                <div className="max-w-md space-y-4">
                  <Input placeholder="Enter text..." />
                  <Input label="Email" type="email" placeholder="name@example.com" />
                  <Input label="Password" type="password" placeholder="••••••••" />
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  States
                </h2>
                <div className="max-w-md space-y-4">
                  <Input label="Default" placeholder="Normal state" />
                  <Input label="Disabled" placeholder="Disabled input" disabled />
                  <Input label="Error" placeholder="Invalid input" error helperText="This field is required" />
                  <Input label="With Helper Text" placeholder="Helpful text" helperText="This is helpful information" />
                </div>
              </section>
            </>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage Examples
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Basic Usage
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`import Input from "@/components/Input/Input";

<Input placeholder="Enter text..." />
<Input label="Email" type="email" />
<Input label="Password" type="password" />`}</code>
                  </pre>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

