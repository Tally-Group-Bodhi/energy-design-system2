"use client";

import { RadioGroup, RadioItem } from "@/components/RadioGroup/RadioGroup";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function RadioGroupPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [value, setValue] = useState("option1");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Radio Group" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Radio group components allow users to select a single option from
              a list of mutually exclusive choices.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Basic Radio Group
                </h2>
                <div className="max-w-md space-y-4">
                  <RadioGroup label="Choose an option" name="options">
                    <RadioItem label="Option 1" value="option1" />
                    <RadioItem label="Option 2" value="option2" />
                    <RadioItem label="Option 3" value="option3" />
                  </RadioGroup>
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Controlled
                </h2>
                <div className="max-w-md space-y-4">
                  <RadioGroup label="Controlled selection">
                    <RadioItem
                      label="Option 1"
                      name="controlled"
                      value="option1"
                      checked={value === "option1"}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <RadioItem
                      label="Option 2"
                      name="controlled"
                      value="option2"
                      checked={value === "option2"}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <RadioItem
                      label="Option 3"
                      name="controlled"
                      value="option3"
                      checked={value === "option3"}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </RadioGroup>
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
                <code>{`import { RadioGroup, RadioItem } from "@/components/RadioGroup/RadioGroup";

<RadioGroup label="Choose an option" name="options">
  <RadioItem label="Option 1" value="option1" />
  <RadioItem label="Option 2" value="option2" />
</RadioGroup>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

