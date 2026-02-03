"use client";

import AspectRatio from "@/components/AspectRatio/AspectRatio";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function AspectRatioPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Aspect Ratio" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Aspect ratio keeps content at a fixed proportion (e.g. 16:9 for
              video). Uses our border and background tokens.
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Ratios
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm text-gray-600">16:9</p>
                  <AspectRatio ratio={16 / 9}>
                    <div className="flex h-full items-center justify-center rounded-md border border-border bg-muted">
                      <span className="text-muted-foreground">16:9</span>
                    </div>
                  </AspectRatio>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600">4:3</p>
                  <AspectRatio ratio={4 / 3}>
                    <div className="flex h-full items-center justify-center rounded-md border border-border bg-muted">
                      <span className="text-muted-foreground">4:3</span>
                    </div>
                  </AspectRatio>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600">1:1 (square)</p>
                  <AspectRatio ratio={1}>
                    <div className="flex h-full items-center justify-center rounded-md border border-border bg-muted">
                      <span className="text-muted-foreground">1:1</span>
                    </div>
                  </AspectRatio>
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
                <code>{`import AspectRatio from "@/components/AspectRatio/AspectRatio";

<AspectRatio ratio={16 / 9}>
  <img src="..." alt="..." />
</AspectRatio>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
