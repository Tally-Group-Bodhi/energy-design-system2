"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function CardPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Card" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Card components provide a container for grouping related content
              and actions. They help organize information and create visual
              hierarchy.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Basic Card
                </h2>
                <div className="max-w-md">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>
                        Card description goes here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Card content area.</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Card with Footer
                </h2>
                <div className="max-w-md">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card with Actions</CardTitle>
                      <CardDescription>
                        Cards can include action buttons in the footer.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Content goes here.</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="primary">Action</Button>
                      <Button variant="outline" className="ml-2">
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </section>
            </>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage Examples
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Basic Card
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card/Card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>`}</code>
                  </pre>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

