"use client";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/Tooltip/Tooltip";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function TooltipPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Tooltip" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Tooltips show extra information on hover. They use our
              primary colour for borders and card background; icons from
              Material Symbols.
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Basic tooltip
              </h2>
              <div className="flex flex-wrap gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <Icon name="help" size={18} className="mr-2" />
                      Hover me
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm">This is a tooltip.</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Icon name="info" size={24} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-sm">More information here.</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-help items-center gap-1 text-primary underline decoration-dotted">
                      <Icon name="lightbulb" size={18} />
                      Tip
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="text-sm">
                      Tooltips use our Energy design system colours.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </section>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/Tooltip/Tooltip";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline"><Icon name="help" /> Hover me</Button>
  </TooltipTrigger>
  <TooltipContent side="top">
    <p>Tooltip content here.</p>
  </TooltipContent>
</Tooltip>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
