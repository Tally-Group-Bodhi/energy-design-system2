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
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import Checkbox from "@/components/Checkbox/Checkbox";
import Switch from "@/components/Switch/Switch";
import Badge from "@/components/Badge/Badge";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/Table/Table";
import { Icon } from "@/components/ui/icon";
import { useState } from "react";

// Sample data for energy/utility cards
const weeklyConsumptionData = [320, 280, 350, 290, 310, 220, 180];
const meterReadingsData = [
  { date: "01 Feb 2026", reading: "12,450 kWh", status: "Estimated" },
  { date: "01 Jan 2026", reading: "11,820 kWh", status: "Actual" },
  { date: "01 Dec 2025", reading: "10,940 kWh", status: "Actual" },
];
const accountContactsData = [
  { name: "Jane Smith", role: "Billing contact" },
  { name: "John Smith", role: "Account holder" },
];

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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              Card components provide a container for grouping related content
              and actions. They help organize information and create visual
              hierarchy.
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
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

              <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
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

              <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Energy & utility card examples
                </h2>
                <p className="mb-6 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
                  Cards for dashboards and apps using energy and utility
                  nomenclature: consumption, tariffs, meter readings, and alerts.
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Metric: Total consumption */}
                  <Card className="flex flex-col">
                    <CardContent className="px-5 pb-5 pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total consumption
                          </p>
                          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                            38,450 kWh
                          </p>
                          <div className="mt-2 flex items-center gap-1 text-sm">
                            <Icon
                              name="trending_up"
                              size={16}
                              className="text-[#C40000]"
                            />
                            <span className="font-medium text-[#C40000]">
                              +12.5%
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">vs last month</span>
                          </div>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2C365D]/10 dark:bg-[#2C365D]/20">
                          <Icon name="bolt" size={20} className="text-[#2C365D]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metric: Peak demand */}
                  <Card className="flex flex-col">
                    <CardContent className="px-5 pb-5 pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Peak demand
                          </p>
                          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                            124 kW
                          </p>
                          <div className="mt-2 flex items-center gap-1 text-sm">
                            <Icon
                              name="trending_down"
                              size={16}
                              className="text-[#008000]"
                            />
                            <span className="font-medium text-[#008000]">
                              -8.2%
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">vs last month</span>
                          </div>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2C365D]/10 dark:bg-[#2C365D]/20">
                          <Icon name="show_chart" size={20} className="text-[#2C365D]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metric + mini chart: Cost */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">
                        Cost this month
                      </CardTitle>
                      <CardDescription>Current billing period</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$8,245</p>
                      <div className="mt-3 flex h-12 items-end gap-0.5">
                        {weeklyConsumptionData.map((val, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-[#2C365D]/30 dark:bg-[#2C365D]/50"
                            style={{ height: `${(val / 350) * 100}%`, minHeight: 4 }}
                            title={`${val} kWh`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Weekly consumption (kWh)
                      </p>
                    </CardContent>
                  </Card>

                  {/* Form: Report meter issue */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">
                        Report meter issue
                      </CardTitle>
                      <CardDescription>
                        Submit a fault or query for a supply point.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="MPAN / MPRN"
                          placeholder="e.g. 1234567890123"
                        />
                        <Select label="Issue type">
                          <option value="">Select type</option>
                          <option value="fault">Meter fault</option>
                          <option value="reading">Disputed reading</option>
                          <option value="access">Access required</option>
                        </Select>
                      </div>
                      <Input
                        label="Description"
                        placeholder="Brief description of the issue"
                      />
                    </CardContent>
                    <CardFooter>
                      <Button variant="primary">Submit</Button>
                      <Button variant="outline" className="ml-2">
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Table: Meter readings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">
                        Meter readings
                      </CardTitle>
                      <CardDescription>Recent actual and estimated</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-600 dark:text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-400">Reading</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-400">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {meterReadingsData.map((row, i) => (
                            <TableRow key={i} className="dark:border-gray-700">
                              <TableCell className="text-sm dark:text-gray-300">{row.date}</TableCell>
                              <TableCell className="font-medium dark:text-gray-200">{row.reading}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{row.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* List: Account contacts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">
                        People with access
                      </CardTitle>
                      <CardDescription>Contacts for this account</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-3">
                        {accountContactsData.map((person, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2C365D]/10 dark:bg-[#2C365D]/20 text-sm font-medium text-[#2C365D] dark:text-[#7c8cb8]">
                                {person.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {person.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {person.role}
                                </p>
                              </div>
                            </div>
                            <div className="w-[88px] shrink-0">
                              <Select className="w-full text-xs" defaultValue="view">
                                <option value="view">View</option>
                                <option value="edit">Edit</option>
                                <option value="remove">Remove</option>
                              </Select>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Info: Current tariff */}
                  <Card className="min-h-[240px]">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">
                        Current tariff
                      </CardTitle>
                      <CardDescription>Residential single rate</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Peak rate</span>
                          <span className="font-medium dark:text-gray-200">28.5¢/kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Off-peak</span>
                          <span className="font-medium dark:text-gray-200">18.2¢/kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Standing charge</span>
                          <span className="font-medium dark:text-gray-200">45¢/day</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <Badge variant="secondary">Peak</Badge>
                        <Badge variant="secondary">Off-peak</Badge>
                        <Badge variant="success">Green</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chat: Support */}
                  <Card className="flex flex-col row-span-2 min-h-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">
                        Support
                      </CardTitle>
                      <CardDescription>
                        Chat with our team about your account or supply
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-1 flex-col min-h-0 gap-3">
                      <div className="flex-1 min-h-[200px] overflow-y-auto rounded-lg border border-border dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 p-3 space-y-3">
                        <div className="flex justify-start">
                          <div className="max-w-[85%] rounded-lg rounded-tl-none bg-[#2C365D]/10 dark:bg-[#2C365D]/25 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                            Hi, your meter reading for January has been received. Anything else?
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="max-w-[85%] rounded-lg rounded-tr-none bg-[#2C365D] px-3 py-2 text-sm text-white">
                            Can I get a copy of my bill?
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="max-w-[85%] rounded-lg rounded-tl-none bg-[#2C365D]/10 dark:bg-[#2C365D]/25 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                            Sure, I’ve sent it to your email. Need help with your tariff?
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Input
                          placeholder="Type a message..."
                          className="flex-1"
                        />
                        <Button variant="primary" className="shrink-0">
                          Send
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Settings: Usage alerts */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">
                        Usage alerts
                      </CardTitle>
                      <CardDescription>
                        Notify when usage or budget thresholds are reached.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border border-border dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              High usage alert
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              When consumption exceeds 80% of last month
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Budget alert
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              When estimated cost reaches your budget
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Outage notifications
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Planned and unplanned supply interruptions
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </>
          )}

          {activeTab === "code" && (
            <section className="border-t border-border pt-16 dark:border-gray-700">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
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

