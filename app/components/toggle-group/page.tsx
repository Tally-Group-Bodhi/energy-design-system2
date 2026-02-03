"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ToggleGroup/ToggleGroup";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function ToggleGroupPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [singleValue, setSingleValue] = useState("left");
  const [multiValue, setMultiValue] = useState<string[]>([]);

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Toggle Group" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Toggle groups group related toggles. They use our primary
              colour for the selected state; icons from Material Symbols.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Single selection
                </h2>
                <ToggleGroup
                  type="single"
                  value={singleValue}
                  onValueChange={(v) => setSingleValue(v as string)}
                >
                  <ToggleGroupItem value="left">
                    <Icon name="format_align_left" size={18} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center">
                    <Icon name="format_align_center" size={18} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right">
                    <Icon name="format_align_right" size={18} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="justify">
                    <Icon name="format_align_justify" size={18} />
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {singleValue || "none"}
                </p>
              </section>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Multiple selection
                </h2>
                <ToggleGroup
                  type="multiple"
                  value={multiValue}
                  onValueChange={(v) => setMultiValue(v as string[])}
                >
                  <ToggleGroupItem value="bold">
                    <Icon name="format_bold" size={18} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic">
                    <Icon name="format_italic" size={18} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline">
                    <Icon name="format_underlined" size={18} />
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {multiValue.length ? multiValue.join(", ") : "none"}
                </p>
              </section>
            </>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import { ToggleGroup, ToggleGroupItem } from "@/components/ToggleGroup/ToggleGroup";
import { Icon } from "@/components/ui/icon";

<ToggleGroup type="single" value={value} onValueChange={setValue}>
  <ToggleGroupItem value="left"><Icon name="format_align_left" /></ToggleGroupItem>
  <ToggleGroupItem value="center"><Icon name="format_align_center" /></ToggleGroupItem>
</ToggleGroup>

<ToggleGroup type="multiple" value={values} onValueChange={setValues}>
  <ToggleGroupItem value="bold"><Icon name="format_bold" /></ToggleGroupItem>
  <ToggleGroupItem value="italic"><Icon name="format_italic" /></ToggleGroupItem>
</ToggleGroup>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
