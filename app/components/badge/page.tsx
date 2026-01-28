"use client";

import Badge from "@/components/Badge/Badge";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function BadgePage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Badge" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Badges are small status descriptors that provide visual context
              and help users quickly identify information.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Variants
                </h2>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="outline">Outline</Badge>
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
                <code>{`import Badge from "@/components/Badge/Badge";

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="outline">Outline</Badge>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

