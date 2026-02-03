"use client";

import Progress from "@/components/Progress/Progress";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Progress" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Progress bars show completion or loading. The fill uses our
              primary colour (#2C365D).
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16 text-left">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Variants
              </h2>
              <div className="max-w-2xl space-y-8 text-left">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="trending_up" size={18} />
                    25%
                  </p>
                  <Progress value={25} max={100} />
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="trending_up" size={18} />
                    50%
                  </p>
                  <Progress value={50} max={100} />
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="trending_up" size={18} />
                    75%
                  </p>
                  <Progress value={75} max={100} />
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="check_circle" size={18} />
                    100%
                  </p>
                  <Progress value={100} max={100} />
                </div>
              </div>
            </section>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import Progress from "@/components/Progress/Progress";

<Progress value={50} max={100} />`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
