"use client";

import Slider from "@/components/Slider/Slider";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function SliderPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [value, setValue] = useState([50]);

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Slider" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Sliders let users select a value from a range. The track uses
              our primary colour (#2C365D).
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Basic slider
              </h2>
              <div className="max-w-md space-y-8">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="tune" size={18} />
                    Value: {value[0]}
                  </p>
                  <Slider
                    value={value}
                    onValueChange={setValue}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600">Default (50)</p>
                  <Slider defaultValue={[50]} min={0} max={100} />
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
                <code>{`import Slider from "@/components/Slider/Slider";

<Slider defaultValue={[50]} min={0} max={100} step={1} />
<Slider value={value} onValueChange={setValue} min={0} max={100} />`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
