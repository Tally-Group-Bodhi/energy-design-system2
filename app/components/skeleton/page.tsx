"use client";

import Skeleton from "@/components/Skeleton/Skeleton";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function SkeletonPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Skeleton" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Skeletons show loading placeholders. They use our muted
              colour for the pulse animation.
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16 text-left">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Variants
              </h2>
              <div className="max-w-2xl space-y-6 text-left">
                <div>
                  <p className="mb-2 text-sm text-gray-600">Card skeleton</p>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="mt-4 h-20 w-full" />
                  </div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="article" size={18} />
                    Text lines
                  </p>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
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
                <code>{`import Skeleton from "@/components/Skeleton/Skeleton";

<Skeleton className="h-4 w-full" />
<Skeleton className="size-12 rounded-full" />`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
