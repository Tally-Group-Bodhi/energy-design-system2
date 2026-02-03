import PageBanner from "@/components/PageBanner/PageBanner";

export default function TallyDigitalPage() {
  return (
    <>
      <PageBanner title="Tally Digital" />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="max-w-3xl text-lg leading-7 text-gray-600">
            Brand guidelines and usage for Tally Digital across the design system.
          </p>
        </div>
      </div>
    </>
  );
}
