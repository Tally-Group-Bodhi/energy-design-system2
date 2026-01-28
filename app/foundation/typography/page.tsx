import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";

export default function TypographyPage() {
  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      {/* Page Banner */}
      <PageBanner title="Typography" />

      {/* Tab Navigation */}
      <TabNavigation tabs={tabs} defaultTab="design" />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Page Description */}
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Our typography system establishes clear visual hierarchy and
              ensures consistent, readable text across all digital experiences.
              Each type scale has been carefully crafted to support accessibility
              and brand consistency.
            </p>
          </div>

          {/* Type Scale Section */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Type Scale
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              The type scale provides a consistent set of text styles that work
              harmoniously together to create clear visual hierarchy.
            </p>
            {/* Typography examples will go here */}
          </section>

          {/* Font Families Section */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Font Families
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              Our font families are selected to ensure optimal readability and
              brand consistency across all platforms and devices.
            </p>
            {/* Font family examples will go here */}
          </section>

          {/* Text Styles Section */}
          <section className="mb-16 border-t border-gray-200 pt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
              Text Styles
            </h2>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
              Text styles define how typography is used in different contexts,
              from headings to body text, ensuring consistent application
              throughout the design system.
            </p>
            {/* Text style examples will go here */}
          </section>
        </div>
      </div>
    </>
  );
}

