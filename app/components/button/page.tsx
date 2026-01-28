"use client";

import Button from "@/components/Button/Button";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";

export default function ButtonPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      {/* Page Banner */}
      <PageBanner title="Button" />

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Page Description */}
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Buttons are interactive elements that trigger actions. They provide
              clear visual feedback and guide users through the interface. Our
              button system includes multiple variants, sizes, and states to
              accommodate various use cases while maintaining consistency with
              our brand identity.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              {/* Primary Buttons Section */}
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Primary Buttons
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Primary buttons are used for the most important actions on a
                  page. They use our primary brand color to draw attention and
                  indicate the primary user flow.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="sm">
                    Small Button
                  </Button>
                  <Button variant="primary" size="md">
                    Medium Button
                  </Button>
                  <Button variant="primary" size="lg">
                    Large Button
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </div>
              </section>

              {/* Secondary Buttons Section */}
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Secondary Buttons
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Secondary buttons are used for actions of secondary importance.
                  They use our turquoise accent color to provide visual variety
                  while maintaining brand consistency.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary" size="sm">
                    Small Button
                  </Button>
                  <Button variant="secondary" size="md">
                    Medium Button
                  </Button>
                  <Button variant="secondary" size="lg">
                    Large Button
                  </Button>
                  <Button variant="secondary" disabled>
                    Disabled
                  </Button>
                </div>
              </section>

              {/* Outline Buttons Section */}
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Outline Buttons
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Outline buttons provide a lighter visual weight while still
                  maintaining clear affordance. They work well when you need
                  multiple actions but want to de-emphasize secondary actions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" size="sm">
                    Small Button
                  </Button>
                  <Button variant="outline" size="md">
                    Medium Button
                  </Button>
                  <Button variant="outline" size="lg">
                    Large Button
                  </Button>
                  <Button variant="outline" disabled>
                    Disabled
                  </Button>
                </div>
              </section>

              {/* Ghost Buttons Section */}
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Ghost Buttons
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Ghost buttons have minimal visual presence and are used for
                  tertiary actions or when you want the button to blend into the
                  background until interaction.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="ghost" size="sm">
                    Small Button
                  </Button>
                  <Button variant="ghost" size="md">
                    Medium Button
                  </Button>
                  <Button variant="ghost" size="lg">
                    Large Button
                  </Button>
                  <Button variant="ghost" disabled>
                    Disabled
                  </Button>
                </div>
              </section>

              {/* Semantic Buttons Section */}
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Semantic Buttons
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Semantic buttons communicate specific meanings through color.
                  Use these for actions that require clear status indication,
                  such as confirmation, warnings, or destructive actions.
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900">
                      Success
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="success">Confirm</Button>
                      <Button variant="success" disabled>
                        Disabled
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900">
                      Warning
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="warning">Warning</Button>
                      <Button variant="warning" disabled>
                        Disabled
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900">
                      Error
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="error">Delete</Button>
                      <Button variant="error" disabled>
                        Disabled
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900">
                      Info
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="info">Learn More</Button>
                      <Button variant="info" disabled>
                        Disabled
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Full Width Buttons Section */}
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Full Width Buttons
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Full-width buttons span the entire width of their container.
                  Use these for primary actions on mobile interfaces or when you
                  want to maximize clickability.
                </p>
                <div className="max-w-md space-y-4">
                  <Button variant="primary" fullWidth>
                    Full Width Primary
                  </Button>
                  <Button variant="secondary" fullWidth>
                    Full Width Secondary
                  </Button>
                  <Button variant="outline" fullWidth>
                    Full Width Outline
                  </Button>
                </div>
              </section>

              {/* Button Sizes Comparison Section */}
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Size Comparison
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                  Buttons come in three sizes to accommodate different contexts
                  and density requirements.
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900">
                      Small (sm)
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="primary" size="sm">
                        Small Button
                      </Button>
                      <Button variant="secondary" size="sm">
                        Small Button
                      </Button>
                      <Button variant="outline" size="sm">
                        Small Button
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900">
                      Medium (md) - Default
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="primary" size="md">
                        Medium Button
                      </Button>
                      <Button variant="secondary" size="md">
                        Medium Button
                      </Button>
                      <Button variant="outline" size="md">
                        Medium Button
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900">
                      Large (lg)
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="primary" size="lg">
                        Large Button
                      </Button>
                      <Button variant="secondary" size="lg">
                        Large Button
                      </Button>
                      <Button variant="outline" size="lg">
                        Large Button
                      </Button>
                    </div>
                  </div>
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
                    Basic Usage
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`import Button from "@/components/Button/Button";

// Primary button (default)
<Button variant="primary">Click me</Button>

// Secondary button
<Button variant="secondary">Click me</Button>

// Outline button
<Button variant="outline">Click me</Button>

// Ghost button
<Button variant="ghost">Click me</Button>`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Sizes
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    States
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`<Button disabled>Disabled</Button>
<Button onClick={() => alert('Clicked!')}>With handler</Button>`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Full Width
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`<Button fullWidth>Full Width Button</Button>`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Semantic Variants
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`<Button variant="success">Confirm</Button>
<Button variant="warning">Warning</Button>
<Button variant="error">Delete</Button>
<Button variant="info">Learn More</Button>`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Props
                  </h3>
                  <div className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <pre>
                      <code>{`interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | 
          "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  // ... all standard button HTML attributes
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

