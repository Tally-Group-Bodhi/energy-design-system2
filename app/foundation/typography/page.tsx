"use client";

import { useState } from "react";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import {
  H1,
  H2,
  H3,
  H4,
  P,
  Blockquote,
  Ul,
  Ol,
  InlineCode,
  Lead,
  Large,
  Small,
  Muted,
} from "@/components/Typography/Typography";

function TypographyTable({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: { example: React.ReactNode; name: string; usage: string }[];
}) {
  return (
    <section className="border-t border-border pt-10">
      <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
        {title}
      </h2>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
        {description}
      </p>
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-gray-50/80">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Example
              </th>
              <th className="w-[180px] px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Class / Component
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                Usage
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3 align-baseline">
                  {row.example}
                </td>
                <td className="w-[180px] px-4 py-3 font-mono text-xs text-gray-600 align-baseline">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 align-baseline">
                  {row.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function TypographyPage() {
  const [activeTab, setActiveTab] = useState("design");
  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Typography" />
      <TabNavigation tabs={tabs} defaultTab="design" onTabChange={setActiveTab} />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {activeTab === "design" && (
            <div className="space-y-12">
              {/* Usage intro */}
              <div>
                <p className="max-w-3xl text-base leading-7 text-gray-600">
                  Our typography styles can be consumed as Tailwind classes or
                  via typography components. The classes below pre-set{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">font-size</code>,{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">line-height</code>,{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">letter-spacing</code>, and{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">font-weight</code>.
                  Use <strong>&lt;strong&gt;</strong> for emphasis within a typography class.
                </p>
              </div>

              {/* Font – Inter */}
              <section className="border-t border-border pt-10">
                <h2 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                  Font
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-600">
                  Primary typeface for the design system.
                </p>
                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/80">
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Name
                        </th>
                        <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Usage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3">
                          <span className="text-lg font-semibold text-gray-900">Inter</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Primary typeface for UI, body text, and headings across the design system.
                          Used for all on-screen content unless overridden (e.g. code uses IBM Plex Mono).
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          <span className="font-mono text-lg font-medium text-gray-900">IBM Plex Mono</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Monospace font for code snippets, technical labels, and inline code (IBM Plex Mono).
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Headings */}
              <TypographyTable
                title="Headings"
                description="Used to introduce pages or sections."
                rows={[
                  {
                    example: <H1 className="!text-4xl lg:!text-5xl">Heading 48</H1>,
                    name: "H1",
                    usage: "Page titles and marketing heroes.",
                  },
                  {
                    example: <H2>Heading 32</H2>,
                    name: "H2",
                    usage: "Section headings, marketing subheadings, and dashboard headings.",
                  },
                  {
                    example: <H3>Heading 24</H3>,
                    name: "H3",
                    usage: "Subsections and card titles.",
                  },
                  {
                    example: <H4>Heading 20</H4>,
                    name: "H4",
                    usage: "Minor headings and list group titles.",
                  },
                ]}
              />

              {/* Buttons */}
              <TypographyTable
                title="Buttons"
                description="Only to be used within components that render buttons."
                rows={[
                  {
                    example: <span className="text-base font-medium text-gray-900">Button 16</span>,
                    name: "text-base font-medium",
                    usage: "Largest button (lg).",
                  },
                  {
                    example: <span className="text-sm font-medium text-gray-900">Button 14</span>,
                    name: "text-sm font-medium",
                    usage: "Default button (md).",
                  },
                  {
                    example: <span className="text-xs font-medium text-gray-900">Button 12</span>,
                    name: "text-xs font-medium",
                    usage: "Small button (sm). Use when space is limited.",
                  },
                ]}
              />

              {/* Label */}
              <TypographyTable
                title="Label"
                description="Designed for single lines, with line-height that pairs well with icons."
                rows={[
                  {
                    example: <span className="text-lg font-semibold text-gray-900">Label 18</span>,
                    name: "Large",
                    usage: "Marketing and hero labels.",
                  },
                  {
                    example: <span className="text-base font-semibold text-gray-900">Label 16 <strong>with Strong</strong></span>,
                    name: "text-base font-semibold",
                    usage: "Titles and prominent labels. Use &lt;strong&gt; to differentiate from regular.",
                  },
                  {
                    example: <span className="text-sm font-semibold text-gray-900">Label 14 <strong>with Strong</strong></span>,
                    name: "text-sm font-semibold",
                    usage: "Most common label. Used in menus, cards, and form sections.",
                  },
                  {
                    example: <span className="text-sm font-medium text-gray-900">Label 14</span>,
                    name: "Small",
                    usage: "Captions, field labels, and tertiary text.",
                  },
                  {
                    example: <span className="font-mono text-sm font-medium text-gray-900">Label 14 Mono</span>,
                    name: "font-mono text-sm",
                    usage: "Technical labels and keys.",
                  },
                  {
                    example: <span className="text-xs font-medium uppercase tracking-wide text-gray-600">Label 12 CAPS</span>,
                    name: "text-xs font-medium uppercase",
                    usage: "Tertiary level text: comments, show more, calendar day labels.",
                  },
                ]}
              />

              {/* Copy */}
              <TypographyTable
                title="Copy"
                description="Designed for multiple lines, with higher line-height than Label."
                rows={[
                  {
                    example: <Lead>Copy 20. For hero areas and introductory paragraphs.</Lead>,
                    name: "Lead",
                    usage: "Hero areas on marketing pages and modal intros.",
                  },
                  {
                    example: <Large>Copy 18 with Strong. For emphasis in modals and confirmations.</Large>,
                    name: "Large",
                    usage: "Emphasized single-line copy in dialogs and cards.",
                  },
                  {
                    example: <P className="!mt-0">Copy 16 with Strong. Used in simpler, larger views like modals where text can breathe.</P>,
                    name: "P",
                    usage: "Body text in modals, empty states, and spacious layouts.",
                  },
                  {
                    example: <p className="text-sm leading-6 text-gray-900">Copy 14 with Strong. Most commonly used text style for body copy.</p>,
                    name: "text-sm leading-6",
                    usage: "Default body copy across the app.",
                  },
                  {
                    example: <Muted>Copy 14 Muted. For secondary text and descriptions.</Muted>,
                    name: "Muted",
                    usage: "Secondary text, helper text, and descriptions.",
                  },
                  {
                    example: <p className="text-sm leading-5 text-gray-600">Copy 13. For secondary text and views where space is limited.</p>,
                    name: "text-sm leading-5",
                    usage: "Dense views, tables, and compact lists.",
                  },
                  {
                    example: <p className="text-gray-900">Inline <InlineCode>code</InlineCode> for technical terms and commands.</p>,
                    name: "InlineCode",
                    usage: "Inline code mentions, commands, and variable names.",
                  },
                ]}
              />

              {/* Blockquote & lists */}
              <TypographyTable
                title="Blockquote &amp; lists"
                description="For quoted text and list content in articles and long-form."
                rows={[
                  {
                    example: <Blockquote className="!my-0 !pl-4">&quot;A short quote with left border and italic.&quot;</Blockquote>,
                    name: "Blockquote",
                    usage: "Quoted text and callouts.",
                  },
                  {
                    example: <Ul className="!my-0 !ml-4"><li>List item one</li><li>List item two</li></Ul>,
                    name: "Ul",
                    usage: "Unordered lists.",
                  },
                  {
                    example: <Ol className="!my-0 !ml-4"><li>First step</li><li>Second step</li></Ol>,
                    name: "Ol",
                    usage: "Ordered lists.",
                  },
                ]}
              />
            </div>
          )}

          {activeTab === "code" && (
            <section className="border-t border-border pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                Usage
              </h2>
              <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600">
                Import typography components and use them like HTML elements.
                All accept <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">className</code> and
                standard props.
              </p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import {
  H1, H2, H3, H4,
  P, Blockquote, Ul, Ol,
  InlineCode, Lead, Large, Small, Muted,
} from "@/components/Typography/Typography";

<H1>Page title</H1>
<H2>Section heading</H2>
<P>Body paragraph.</P>
<Lead>Introductory text.</Lead>
<Large>Emphasized text.</Large>
<Small>Caption or label.</Small>
<Muted>Helper text.</Muted>
<InlineCode>npm install foo</InlineCode>
<Blockquote>Quoted text.</Blockquote>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
