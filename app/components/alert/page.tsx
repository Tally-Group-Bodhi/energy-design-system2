"use client";

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/Alert/Alert";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function AlertPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Alert" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Alert components display important messages to users. They provide
              visual feedback for various states and help guide user actions.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Variants
                </h2>
                <div className="max-w-2xl space-y-4">
                  <Alert variant="default">
                    <AlertTitle>Default Alert</AlertTitle>
                    <AlertDescription>
                      This is a default alert message.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="success">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Your changes have been saved successfully.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="warning">
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Please review your information before proceeding.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="error">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Something went wrong. Please try again.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="info">
                    <AlertTitle>Info</AlertTitle>
                    <AlertDescription>
                      Here is some helpful information for you.
                    </AlertDescription>
                  </Alert>
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
                <code>{`import { Alert, AlertTitle, AlertDescription } from "@/components/Alert/Alert";

<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your changes have been saved.
  </AlertDescription>
</Alert>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

