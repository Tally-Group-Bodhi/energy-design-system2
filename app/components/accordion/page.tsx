"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordion/Accordion";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function AccordionPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Accordion" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Accordions let users expand and collapse sections of content.
              They use our primary colour for focus states and borders.
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Basic accordion
              </h2>
              <div className="max-w-2xl">
                <AccordionItem value="item-1">
                  <AccordionTrigger
                    isOpen={openItem === "item-1"}
                    onClick={() =>
                      setOpenItem(openItem === "item-1" ? null : "item-1")
                    }
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="expand_more" size={20} />
                      Getting started
                    </span>
                  </AccordionTrigger>
                  <AccordionContent isOpen={openItem === "item-1"}>
                    Introduction to the design system and how to use our
                    components with Energy brand colours.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger
                    isOpen={openItem === "item-2"}
                    onClick={() =>
                      setOpenItem(openItem === "item-2" ? null : "item-2")
                    }
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="palette" size={20} />
                      Colours & tokens
                    </span>
                  </AccordionTrigger>
                  <AccordionContent isOpen={openItem === "item-2"}>
                    Primary (#2C365D), secondary (#00D2A2), and semantic
                    colours for success, warning, and error.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger
                    isOpen={openItem === "item-3"}
                    onClick={() =>
                      setOpenItem(openItem === "item-3" ? null : "item-3")
                    }
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="widgets" size={20} />
                      Components
                    </span>
                  </AccordionTrigger>
                  <AccordionContent isOpen={openItem === "item-3"}>
                    Buttons, cards, inputs, and more—all using our foundations
                    and Google Material Symbols for icons.
                  </AccordionContent>
                </AccordionItem>
              </div>
            </section>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/Accordion/Accordion";
import { Icon } from "@/components/ui/icon";

<AccordionItem value="item-1">
  <AccordionTrigger isOpen={open} onClick={() => setOpen(!open)}>
    <span className="flex items-center gap-2">
      <Icon name="expand_more" size={20} />
      Section title
    </span>
  </AccordionTrigger>
  <AccordionContent isOpen={open}>
    Section content here.
  </AccordionContent>
</AccordionItem>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
