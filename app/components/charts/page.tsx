"use client";

import { useState } from "react";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { dataVisualizationColors } from "@/lib/tokens/colors";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Treemap,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const CHART_COLORS = [
  dataVisualizationColors.dataASolid.hex,
  dataVisualizationColors.dataBSolid.hex,
  dataVisualizationColors.dataCSolid.hex,
  dataVisualizationColors.dataDSolid.hex,
  dataVisualizationColors.dataESolid.hex,
  dataVisualizationColors.dataFSolid.hex,
] as const;

const lineData = [
  { name: "Jan", value: 400, other: 240 },
  { name: "Feb", value: 300, other: 398 },
  { name: "Mar", value: 200, other: 320 },
  { name: "Apr", value: 278, other: 280 },
  { name: "May", value: 189, other: 390 },
  { name: "Jun", value: 239, other: 280 },
];

const barData = [
  { name: "A", value: 400 },
  { name: "B", value: 300 },
  { name: "C", value: 200 },
  { name: "D", value: 278 },
  { name: "E", value: 189 },
];

const areaData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 278 },
  { name: "May", value: 189 },
  { name: "Jun", value: 239 },
];

const areaDataMulti = [
  { name: "Jan", trendA: 240, trendB: 180, trendC: 120 },
  { name: "Feb", trendA: 200, trendB: 220, trendC: 140 },
  { name: "Mar", trendA: 180, trendB: 190, trendC: 200 },
  { name: "Apr", trendA: 220, trendB: 170, trendC: 210 },
  { name: "May", trendA: 160, trendB: 200, trendC: 180 },
  { name: "Jun", trendA: 190, trendB: 210, trendC: 220 },
];

const pieData = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 200 },
  { name: "Category D", value: 278 },
];

const scatterData = [
  { x: 10, y: 40 },
  { x: 30, y: 30 },
  { x: 50, y: 20 },
  { x: 70, y: 35 },
  { x: 90, y: 25 },
];

const bubbleData = [
  { x: 20, y: 30, z: 50 },
  { x: 40, y: 50, z: 80 },
  { x: 60, y: 25, z: 40 },
  { x: 80, y: 45, z: 60 },
];

const treemapData = [
  { name: "A", value: 100 },
  { name: "B", value: 80 },
  { name: "C", value: 60 },
  { name: "D", value: 40 },
  { name: "E", value: 30 },
];

const radarData = [
  { subject: "A", value: 80 },
  { subject: "B", value: 60 },
  { subject: "C", value: 90 },
  { subject: "D", value: 70 },
  { subject: "E", value: 85 },
];

export default function ChartsPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Charts" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Charts visualise data with line, bar, area, and pie examples
              inspired by{" "}
              <a
                href="https://recharts.github.io/en-US/examples/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:no-underline"
              >
                Recharts examples
              </a>
              . All series and data points use our data visualisation palette
              (Data A–F) so charts stay consistent with the Energy design system.
            </p>
          </div>

          {activeTab === "design" && (
            <div className="space-y-16">
              {/* Line chart */}
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                  Line chart
                </h2>
                <p className="mb-6 max-w-2xl text-sm text-gray-600">
                  Simple line chart with two series. Strokes use Data A and
                  Data B.
                </p>
                <div className="h-80 rounded-lg border border-border bg-card pt-8 px-4 pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 24, right: 16, bottom: 16, left: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Series 1"
                        stroke={CHART_COLORS[0]}
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS[0] }}
                      />
                      <Line
                        type="monotone"
                        dataKey="other"
                        name="Series 2"
                        stroke={CHART_COLORS[1]}
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS[1] }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Bar chart */}
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                  Bar chart
                </h2>
                <p className="mb-6 max-w-2xl text-sm text-gray-600">
                  Simple bar chart. Bars use Data A (turquoise).
                </p>
                <div className="h-80 rounded-lg border border-border bg-card pt-8 px-4 pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 24, right: 16, bottom: 16, left: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Bar dataKey="value" name="Value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Stacked bar chart */}
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                  Stacked bar chart
                </h2>
                <p className="mb-6 max-w-2xl text-sm text-gray-600">
                  Stacked bars with Data A, B, and C.
                </p>
                <div className="h-80 rounded-lg border border-border bg-card pt-8 px-4 pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "A", a: 40, b: 60, c: 80 },
                        { name: "B", a: 30, b: 70, c: 50 },
                        { name: "C", a: 20, b: 50, c: 90 },
                        { name: "D", a: 27, b: 60, c: 40 },
                        { name: "E", a: 18, b: 40, c: 70 },
                      ]}
                      margin={{ top: 24, right: 16, bottom: 16, left: 16 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="a" name="Series A" stackId="1" fill={CHART_COLORS[0]} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="b" name="Series B" stackId="1" fill={CHART_COLORS[1]} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="c" name="Series C" stackId="1" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Area chart */}
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                  Area chart
                </h2>
                <p className="mb-6 max-w-2xl text-sm text-gray-600">
                  Simple area chart. Fill and stroke use Data A (turquoise).
                </p>
                <div className="h-80 rounded-lg border border-border bg-card pt-8 px-4 pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 24, right: 16, bottom: 16, left: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Value"
                        stroke={CHART_COLORS[0]}
                        fill={CHART_COLORS[0]}
                        fillOpacity={0.4}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <h3 className="mt-10 mb-2 text-lg font-semibold tracking-tight text-gray-900">
                  Area chart with 3 trends
                </h3>
                <p className="mb-6 max-w-2xl text-sm text-gray-600">
                  Stacked area chart with three series. Uses Data A, B, and C for
                  the three trends.
                </p>
                <div className="h-80 rounded-lg border border-border bg-card pt-8 px-4 pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaDataMulti} margin={{ top: 24, right: 16, bottom: 16, left: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="trendA"
                        name="Trend A"
                        stackId="1"
                        stroke={CHART_COLORS[0]}
                        fill={CHART_COLORS[0]}
                        fillOpacity={0.5}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="trendB"
                        name="Trend B"
                        stackId="1"
                        stroke={CHART_COLORS[1]}
                        fill={CHART_COLORS[1]}
                        fillOpacity={0.5}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="trendC"
                        name="Trend C"
                        stackId="1"
                        stroke={CHART_COLORS[2]}
                        fill={CHART_COLORS[2]}
                        fillOpacity={0.5}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Pie chart */}
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                  Pie chart
                </h2>
                <p className="mb-6 max-w-2xl text-sm text-gray-600">
                  Simple pie chart. Segments use Data A–D.
                </p>
                <div className="h-80 rounded-lg border border-border bg-card pt-8 px-4 pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 24, right: 16, bottom: 16, left: 16 }}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Chart size variants */}
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                  Chart size variants
                </h2>
                <p className="mb-8 max-w-2xl text-sm text-gray-600">
                  Four size variants in ascending order: XS widget (square, graph
                  only), widget (256×96px, grid-aligned w-64 h-24), medium
                  (reduced height), default (full height).
                </p>

                <div className="flex flex-col items-start text-left">
                {/* XS Widget */}
                <div className="mb-10 w-full">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    XS Widget
                  </h3>
                  <p className="mb-4 text-sm text-gray-500">
                    Square (112×112px). Graph only with X and Y axes; no
                    numbers or labels on either axis. Title only.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Trend
                      </p>
                      <div className="h-[82px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={lineData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" />
                            <XAxis dataKey="name" stroke="#6B7280" tick={false} tickLine={false} axisLine />
                            <YAxis stroke="#6B7280" tick={false} tickLine={false} width={4} axisLine />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={CHART_COLORS[0]}
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Volume
                      </p>
                      <div className="h-[82px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={lineData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" />
                            <XAxis dataKey="name" stroke="#6B7280" tick={false} tickLine={false} axisLine />
                            <YAxis stroke="#6B7280" tick={false} tickLine={false} width={4} axisLine />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Share
                      </p>
                      <div className="h-[82px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={18}
                              outerRadius={32}
                              paddingAngle={1}
                              dataKey="value"
                            >
                              {pieData.map((_, index) => (
                                <Cell key={`xs-pie-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Scatter
                      </p>
                      <div className="h-[82px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <XAxis dataKey="x" type="number" stroke="#6B7280" tick={false} tickLine={false} axisLine />
                            <YAxis dataKey="y" type="number" stroke="#6B7280" tick={false} tickLine={false} width={4} axisLine />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Scatter name="Points" data={scatterData} fill={CHART_COLORS[0]} />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Treemap
                      </p>
                      <div className="h-[82px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <Treemap
                            data={treemapData}
                            dataKey="value"
                            stroke="#fff"
                            content={(node: { x: number; y: number; width: number; height: number; index: number }) => (
                              <g>
                                <rect
                                  x={node.x}
                                  y={node.y}
                                  width={node.width}
                                  height={node.height}
                                  fill={CHART_COLORS[node.index % CHART_COLORS.length]}
                                  stroke="#fff"
                                  strokeWidth={1}
                                />
                              </g>
                            )}
                          >
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                          </Treemap>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Bubble
                      </p>
                      <div className="h-[82px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <XAxis dataKey="x" type="number" stroke="#6B7280" tick={false} tickLine={false} axisLine />
                            <YAxis dataKey="y" type="number" stroke="#6B7280" tick={false} tickLine={false} width={4} axisLine />
                            <ZAxis dataKey="z" type="number" range={[50, 400]} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Scatter name="Bubble" data={bubbleData} fill={CHART_COLORS[0]} />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        3 trends
                      </p>
                      <div className="h-[82px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={areaDataMulti} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <XAxis dataKey="name" stroke="#6B7280" tick={false} tickLine={false} axisLine />
                            <YAxis stroke="#6B7280" tick={false} tickLine={false} width={4} axisLine />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="trendA"
                              stackId="1"
                              stroke={CHART_COLORS[0]}
                              fill={CHART_COLORS[0]}
                              fillOpacity={0.5}
                              strokeWidth={1}
                            />
                            <Area
                              type="monotone"
                              dataKey="trendB"
                              stackId="1"
                              stroke={CHART_COLORS[1]}
                              fill={CHART_COLORS[1]}
                              fillOpacity={0.5}
                              strokeWidth={1}
                            />
                            <Area
                              type="monotone"
                              dataKey="trendC"
                              stackId="1"
                              stroke={CHART_COLORS[2]}
                              fill={CHART_COLORS[2]}
                              fillOpacity={0.5}
                              strokeWidth={1}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Radar
                      </p>
                      <div className="h-[82px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <PolarGrid stroke="#E5E7EB" />
                            <PolarAngleAxis dataKey="subject" stroke="#6B7280" tick={false} tickLine={false} />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                              name="Score"
                              dataKey="value"
                              stroke={CHART_COLORS[0]}
                              fill={CHART_COLORS[0]}
                              fillOpacity={0.4}
                              strokeWidth={1}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Widget */}
                <div className="mb-10 w-full">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    Widget
                  </h3>
                  <p className="mb-4 text-sm text-gray-500">
                    Compact (256×96px). Aligns with grid: w-64, h-24. Use for
                    dashboard cards and compact panels.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="h-24 w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Trend
                      </p>
                      <div className="h-[68px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={lineData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" />
                            <XAxis dataKey="name" stroke="#6B7280" fontSize={8} tickLine={false} tick={{ fontSize: 8 }} />
                            <YAxis stroke="#6B7280" fontSize={8} tickLine={false} width={20} tick={{ fontSize: 8 }} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={CHART_COLORS[0]}
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-24 w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Volume
                      </p>
                      <div className="h-[68px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={lineData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" />
                            <XAxis dataKey="name" stroke="#6B7280" fontSize={8} tickLine={false} tick={{ fontSize: 8 }} />
                            <YAxis stroke="#6B7280" fontSize={8} tickLine={false} width={20} tick={{ fontSize: 8 }} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-24 w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Share
                      </p>
                      <div className="h-[68px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={22}
                              outerRadius={36}
                              paddingAngle={1}
                              dataKey="value"
                            >
                              {pieData.map((_, index) => (
                                <Cell key={`w-pie-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-24 w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Scatter
                      </p>
                      <div className="h-[68px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <XAxis dataKey="x" type="number" stroke="#6B7280" fontSize={8} tickLine={false} tick={{ fontSize: 8 }} />
                            <YAxis dataKey="y" type="number" stroke="#6B7280" fontSize={8} tickLine={false} width={24} tick={{ fontSize: 8 }} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Scatter name="Points" data={scatterData} fill={CHART_COLORS[0]} />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-24 w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Treemap
                      </p>
                      <div className="h-[68px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <Treemap
                            data={treemapData}
                            dataKey="value"
                            stroke="#fff"
                            content={(node: { x: number; y: number; width: number; height: number; index: number }) => (
                              <g>
                                <rect
                                  x={node.x}
                                  y={node.y}
                                  width={node.width}
                                  height={node.height}
                                  fill={CHART_COLORS[node.index % CHART_COLORS.length]}
                                  stroke="#fff"
                                  strokeWidth={1}
                                />
                              </g>
                            )}
                          >
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                          </Treemap>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-24 w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Bubble
                      </p>
                      <div className="h-[68px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <XAxis dataKey="x" type="number" stroke="#6B7280" fontSize={8} tickLine={false} tick={{ fontSize: 8 }} />
                            <YAxis dataKey="y" type="number" stroke="#6B7280" fontSize={8} tickLine={false} width={24} tick={{ fontSize: 8 }} />
                            <ZAxis dataKey="z" type="number" range={[50, 400]} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Scatter name="Bubble" data={bubbleData} fill={CHART_COLORS[0]} />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-24 w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        3 trends
                      </p>
                      <div className="h-[68px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={areaDataMulti} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <XAxis dataKey="name" stroke="#6B7280" fontSize={8} tickLine={false} tick={{ fontSize: 8 }} />
                            <YAxis stroke="#6B7280" fontSize={8} tickLine={false} width={20} tick={{ fontSize: 8 }} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="trendA"
                              name="A"
                              stackId="1"
                              stroke={CHART_COLORS[0]}
                              fill={CHART_COLORS[0]}
                              fillOpacity={0.5}
                              strokeWidth={1.5}
                            />
                            <Area
                              type="monotone"
                              dataKey="trendB"
                              name="B"
                              stackId="1"
                              stroke={CHART_COLORS[1]}
                              fill={CHART_COLORS[1]}
                              fillOpacity={0.5}
                              strokeWidth={1.5}
                            />
                            <Area
                              type="monotone"
                              dataKey="trendC"
                              name="C"
                              stackId="1"
                              stroke={CHART_COLORS[2]}
                              fill={CHART_COLORS[2]}
                              fillOpacity={0.5}
                              strokeWidth={1.5}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-24 w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card p-2">
                      <p className="mb-0.5 truncate text-[10px] font-medium text-gray-500">
                        Radar
                      </p>
                      <div className="h-[68px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <PolarGrid stroke="#E5E7EB" />
                            <PolarAngleAxis
                              dataKey="subject"
                              stroke="#6B7280"
                              fontSize={8}
                              tick={{ fontSize: 8 }}
                              tickLine={false}
                            />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                              name="Score"
                              dataKey="value"
                              stroke={CHART_COLORS[0]}
                              fill={CHART_COLORS[0]}
                              fillOpacity={0.4}
                              strokeWidth={1.5}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medium */}
                <div className="mb-10 w-full">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    Medium
                  </h3>
                  <p className="mb-4 text-sm text-gray-500">
                    Reduced height (256px), optional max width. Use for
                    side-by-side or constrained layouts.
                  </p>
                  <div className="max-w-3xl">
                    <div className="h-64 rounded-lg border border-border bg-card pt-6 px-4 pb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData} margin={{ top: 20, right: 12, bottom: 12, left: 12 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                          <YAxis stroke="#6B7280" fontSize={11} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid #E5E7EB",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            name="Series 1"
                            stroke={CHART_COLORS[0]}
                            strokeWidth={2}
                            dot={{ fill: CHART_COLORS[0], r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="other"
                            name="Series 2"
                            stroke={CHART_COLORS[1]}
                            strokeWidth={2}
                            dot={{ fill: CHART_COLORS[1], r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Default */}
                <div className="w-full">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    Default
                  </h3>
                  <p className="mb-4 text-sm text-gray-500">
                    Full height (320px). Use for main content and full-width
                    sections.
                  </p>
                  <div className="h-80 rounded-lg border border-border bg-card pt-8 px-4 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 24, right: 16, bottom: 16, left: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Series 1"
                          stroke={CHART_COLORS[0]}
                          strokeWidth={2}
                          dot={{ fill: CHART_COLORS[0] }}
                        />
                        <Line
                          type="monotone"
                          dataKey="other"
                          name="Series 2"
                          stroke={CHART_COLORS[1]}
                          strokeWidth={2}
                          dot={{ fill: CHART_COLORS[1] }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                </div>
              </section>

            </div>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <p className="mb-4 max-w-3xl text-base leading-6 text-gray-600">
                Use Recharts with our data visualisation colours from{" "}
                <code className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-sm">
                  @/lib/tokens/colors
                </code>
                . Import <code className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-sm">dataVisualizationColors</code> and use the solid hex values (e.g. dataVisualizationColors.dataASolid.hex) for strokes and fills.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import { dataVisualizationColors } from "@/lib/tokens/colors";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [{ name: "Jan", value: 400 }, { name: "Feb", value: 300 }];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <Line type="monotone" dataKey="value" stroke={dataVisualizationColors.dataASolid.hex} strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
