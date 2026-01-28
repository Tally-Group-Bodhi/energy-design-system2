"use client";

import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ButtonGroup/ButtonGroup";
import Button from "@/components/Button/Button";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function ButtonGroupPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Button Group" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              A container that groups related buttons together with consistent
              styling. Button groups help maintain visual consistency and
              spacing when multiple actions are related.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Basic Button Group
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Group buttons together for related actions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <ButtonGroup>
                    <Button variant="outline">Archive</Button>
                    <Button variant="outline">Report</Button>
                  </ButtonGroup>
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Orientation
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Change the button group layout using the orientation prop.
                </p>
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900">
                      Horizontal (default)
                    </h3>
                    <ButtonGroup orientation="horizontal">
                      <Button variant="outline" size="sm">
                        +
                      </Button>
                      <Button variant="outline" size="sm">
                        -
                      </Button>
                    </ButtonGroup>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900">
                      Vertical
                    </h3>
                    <ButtonGroup orientation="vertical" className="w-fit">
                      <Button variant="outline" size="sm">
                        +
                      </Button>
                      <Button variant="outline" size="sm">
                        -
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Nested Groups
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Nest button groups to create complex layouts with spacing
                  between groups.
                </p>
                <ButtonGroup>
                  <ButtonGroup>
                    <Button variant="outline" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button variant="outline" size="sm">
                      4
                    </Button>
                    <Button variant="outline" size="sm">
                      5
                    </Button>
                  </ButtonGroup>
                </ButtonGroup>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  With Separator
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Add visual separation between buttons using the separator
                  component.
                </p>
                <ButtonGroup>
                  <Button variant="outline">Button 1</Button>
                  <ButtonGroupSeparator />
                  <Button variant="outline">Button 2</Button>
                </ButtonGroup>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  With Text
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Include text labels within button groups.
                </p>
                <ButtonGroup>
                  <ButtonGroupText>Label:</ButtonGroupText>
                  <Button variant="outline">Action</Button>
                </ButtonGroup>
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
                    Basic Usage
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`import { ButtonGroup } from "@/components/ButtonGroup/ButtonGroup";
import Button from "@/components/Button/Button";

<ButtonGroup>
  <Button variant="outline">Archive</Button>
  <Button variant="outline">Report</Button>
</ButtonGroup>`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Orientation
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`<ButtonGroup orientation="horizontal">
  <Button variant="outline">Button 1</Button>
  <Button variant="outline">Button 2</Button>
</ButtonGroup>

<ButtonGroup orientation="vertical">
  <Button variant="outline">Button 1</Button>
  <Button variant="outline">Button 2</Button>
</ButtonGroup>`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    With Separator
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`import { ButtonGroup, ButtonGroupSeparator } from "@/components/ButtonGroup/ButtonGroup";

<ButtonGroup>
  <Button variant="outline">Button 1</Button>
  <ButtonGroupSeparator />
  <Button variant="outline">Button 2</Button>
</ButtonGroup>`}</code>
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

