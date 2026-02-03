"use client";

import {
  ToastProvider,
  ToastViewport,
  useToast,
} from "@/components/Toast/Toast";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

function ToastDemo() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="primary"
        onClick={() => addToast("Changes saved successfully.", 5000)}
      >
        <Icon name="check_circle" size={18} className="mr-2" />
        Show success toast
      </Button>
      <Button
        variant="outline"
        onClick={() => addToast("Here is some helpful information.", 5000)}
      >
        <Icon name="info" size={18} className="mr-2" />
        Show info toast
      </Button>
    </div>
  );
}

export default function ToastPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Toast" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-12">
              <p className="max-w-3xl text-lg leading-7 text-gray-600">
                Toasts show short messages. They use our primary colour for
                focus and borders; icons from Material Symbols.
              </p>
            </div>

            {activeTab === "design" && (
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Trigger toast
                </h2>
                <ToastDemo />
                <p className="mt-4 text-sm text-gray-600">
                  Toasts appear in the top-right. They auto-dismiss after 5
                  seconds.
                </p>
              </section>
            )}

            {activeTab === "code" && (
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                  Usage
                </h2>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`import { ToastProvider, ToastViewport, useToast } from "@/components/Toast/Toast";
import Button from "@/components/Button/Button";

// Wrap your app (or page) with ToastProvider
<ToastProvider>
  <ToastViewport />
  <YourContent />
</ToastProvider>

// In a component:
function MyComponent() {
  const { addToast } = useToast();
  return (
    <Button onClick={() => addToast("Message here.", 5000)}>
      Show toast
    </Button>
  );
}`}</code>
                </pre>
              </section>
            )}
          </div>
        </div>
        <ToastViewport />
      </ToastProvider>
    </>
  );
}
