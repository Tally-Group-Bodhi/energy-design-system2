"use client";

import { ElectricityUsageWidget } from "@/components/ElectricityUsageWidget/ElectricityUsageWidget";
import {
  ELECTRICITY_CSV_PATH,
  computeWidgetData,
  parseElectricityCSV,
  type ElectricityWidgetData,
} from "@/lib/data/electricityUsage";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useEffect, useState } from "react";

const FALLBACK_DATA: ElectricityWidgetData = {
  title: "Electricity Usage",
  value: "$9,134",
  changePercent: 2.5,
  secondaryLabel: "Avg. score $185,301",
  weekly: {
    value: "$2,197",
    changePercent: 19.6,
    comparisonText: "Compared to $1,340 last week",
  },
  monthly: {
    value: "$8,903",
    changePercent: 1.9,
    comparisonText: "Compared to $5,441 last month",
  },
  yearly: {
    value: "$98,134",
    changePercent: 22,
    comparisonText: "Compared to $76,330 last year",
  },
  monthlyCompact: {
    value: "$8,097",
    changePercent: 19.6,
    comparisonText: "44.214 USD",
  },
  yearlyCompact: {
    value: "$312,134",
    changePercent: 2.5,
    comparisonText: "301.002 USD",
  },
  dotData: [],
  chartMonths: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  chartCols: 8,
  chartRows: 7,
};

export default function ElectricityUsageWidgetPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [data, setData] = useState<ElectricityWidgetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(ELECTRICITY_CSV_PATH)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error("Failed to fetch"))))
      .then((text) => {
        const rows = parseElectricityCSV(text);
        setData(computeWidgetData(rows));
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const shared = data ?? FALLBACK_DATA;

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Electricity Usage Widget" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              A dashboard widget that displays electricity usage in five sizes
              (X-Small → X-Large). Data is loaded from{" "}
              <code className="rounded bg-gray-200 px-1 py-0.5 text-sm">
                electricity_usage_6months.csv
              </code>
              .
            </p>
            {loading && (
              <p className="mt-2 text-sm text-gray-500">Loading CSV data…</p>
            )}
            {!loading && data && (
              <p className="mt-2 text-sm text-green-700">
                Using 6‑month electricity usage data from the CSV.
              </p>
            )}
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  All sizes (same data)
                </h2>
                <p className="mb-6 max-w-2xl text-gray-600">
                  One dataset from the CSV, five layouts. Use the grid to mix
                  sizes on a dashboard.
                </p>

                <div className="space-y-12">
                  <div>
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                      X-Small
                    </h3>
                    <div className="inline-block">
                      <ElectricityUsageWidget
                        size="x-small"
                        title={shared.title}
                        value={shared.value}
                        changePercent={shared.changePercent}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                      Small
                    </h3>
                    <div className="w-fit">
                      <ElectricityUsageWidget
                        size="small"
                        title={shared.title}
                        value={shared.value}
                        changePercent={shared.changePercent}
                        secondaryLabel={shared.secondaryLabel}
                        showIcon
                        dotData={shared.dotData.length ? shared.dotData : undefined}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                      Medium
                    </h3>
                    <div className="w-fit">
                      <ElectricityUsageWidget
                        size="medium"
                        title={shared.title}
                        value={shared.value}
                        changePercent={shared.changePercent}
                        secondaryLabel={shared.secondaryLabel}
                        dotData={shared.dotData.length ? shared.dotData : undefined}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                      Large
                    </h3>
                    <div className="max-w-3xl">
                      <ElectricityUsageWidget
                        size="large"
                        title={shared.title}
                        value={shared.value}
                        weekly={shared.weekly}
                        monthly={shared.monthly}
                        yearly={shared.yearly}
                        chartMonths={shared.chartMonths}
                        dotData={shared.dotData.length ? shared.dotData : undefined}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                      X-Large
                    </h3>
                    <div className="max-w-4xl">
                      <ElectricityUsageWidget
                        size="x-large"
                        title={shared.title}
                        value={shared.value}
                        weekly={shared.weekly}
                        monthly={shared.monthly}
                        yearly={shared.yearly}
                        chartMonths={shared.chartMonths}
                        dotData={shared.dotData.length ? shared.dotData : undefined}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-16 border-t border-gray-200 pt-16">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">
                  Dashboard grid example
                </h2>
                <p className="mb-6 max-w-2xl text-gray-600">
                  Mix sizes in one dashboard. Same CSV-derived data passed to
                  each.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <ElectricityUsageWidget
                    size="x-small"
                    title={shared.title}
                    value={shared.value}
                    changePercent={shared.changePercent}
                  />
                  <ElectricityUsageWidget
                    size="small"
                    title={shared.title}
                    value={shared.value}
                    changePercent={shared.changePercent}
                    secondaryLabel={shared.secondaryLabel}
                    dotData={shared.dotData.length ? shared.dotData : undefined}
                  />
                  <ElectricityUsageWidget
                    size="medium"
                    title={shared.title}
                    value={shared.value}
                    changePercent={shared.changePercent}
                    secondaryLabel={shared.secondaryLabel}
                    dotData={shared.dotData.length ? shared.dotData : undefined}
                  />
                  <ElectricityUsageWidget
                    size="large"
                    title={shared.title}
                    value={shared.value}
                    weekly={shared.weekly}
                    monthly={shared.monthly}
                    yearly={shared.yearly}
                    chartMonths={shared.chartMonths}
                    dotData={shared.dotData.length ? shared.dotData : undefined}
                  />
                </div>
              </section>
            </>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Load from CSV
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{`import { parseElectricityCSV, computeWidgetData, ELECTRICITY_CSV_PATH } from "@/lib/data/electricityUsage";

const res = await fetch(ELECTRICITY_CSV_PATH);
const text = await res.text();
const rows = parseElectricityCSV(text);
const data = computeWidgetData(rows);

<ElectricityUsageWidget
  title={data.title}
  value={data.value}
  changePercent={data.changePercent}
  secondaryLabel={data.secondaryLabel}
  weekly={data.weekly}
  monthly={data.monthly}
  yearly={data.yearly}
  dotData={data.dotData}
  chartMonths={data.chartMonths}
/>`}</code>
                  </pre>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    Size prop
                  </h3>
                  <p className="mb-2 text-gray-600">
                    <code className="rounded bg-gray-200 px-1 py-0.5 text-sm">size</code> accepts:{" "}
                    <code className="text-gray-800">"x-small"</code>,{" "}
                    <code className="text-gray-800">"small"</code>,{" "}
                    <code className="text-gray-800">"medium"</code>,{" "}
                    <code className="text-gray-800">"large"</code>,{" "}
                    <code className="text-gray-800">"x-large"</code>. Default is{" "}
                    <code className="text-gray-800">"small"</code>.
                  </p>
                  <p className="text-gray-600">
                    For medium/large/x-large, pass <code className="rounded bg-gray-200 px-1 py-0.5 text-sm">weekly</code>,{" "}
                    <code className="rounded bg-gray-200 px-1 py-0.5 text-sm">monthly</code>, and{" "}
                    <code className="rounded bg-gray-200 px-1 py-0.5 text-sm">yearly</code> (each:{" "}
                    <code className="text-gray-800">value</code>,{" "}
                    <code className="text-gray-800">changePercent</code>,{" "}
                    <code className="text-gray-800">comparisonText</code>).
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
