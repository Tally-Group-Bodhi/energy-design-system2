"use client";

import Textarea from "@/components/Textarea/Textarea";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function TextareaPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Textarea" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Textarea components allow users to enter and edit multi-line text.
              They provide clear visual feedback and support various states.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Basic Textarea
                </h2>
                <div className="max-w-md space-y-4">
                  <Textarea placeholder="Enter your message..." />
                  <Textarea
                    label="Description"
                    placeholder="Enter a description..."
                  />
                  <Textarea
                    label="Comments"
                    placeholder="Add your comments here..."
                    rows={6}
                  />
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  States
                </h2>
                <div className="max-w-md space-y-4">
                  <Textarea label="Disabled" placeholder="Disabled textarea" disabled />
                  <Textarea
                    label="Error"
                    placeholder="Invalid textarea"
                    error
                    helperText="This field is required"
                  />
                  <Textarea
                    label="With Helper Text"
                    placeholder="Helpful text"
                    helperText="Maximum 500 characters"
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
                <code>{`import Textarea from "@/components/Textarea/Textarea";

<Textarea placeholder="Enter your message..." />
<Textarea label="Description" rows={6} />`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

