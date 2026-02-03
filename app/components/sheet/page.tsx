"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/Sheet/Sheet";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function SheetPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Sheet" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Sheets slide in from the edge (top, right, bottom, left).
              They use our primary colour for actions and borders.
            </p>
          </div>

          {activeTab === "design" && (
            <section className="mb-16 border-t border-gray-200 pt-16">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                Right sheet
              </h2>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Icon name="menu_open" size={18} className="mr-2" />
                    Open sheet
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Sheet title</SheetTitle>
                    <SheetDescription>
                      This sheet uses our Energy design system. Content and
                      actions can use our colours and icons.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 text-sm text-muted-foreground">
                    Main content goes here.
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button variant="primary">Save</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </section>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetFooter,
  SheetTitle, SheetDescription, SheetClose,
} from "@/components/Sheet/Sheet";
import Button from "@/components/Button/Button";

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description.</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
      <Button variant="primary">Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
