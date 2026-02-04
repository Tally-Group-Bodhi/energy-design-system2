import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";
import { H2, H3, P, Ul, Lead } from "@/components/Typography/Typography";

function CursorRulesContent() {
  const rulesPath = join(process.cwd(), ".cursorrules");
  let rulesContent = "";
  try {
    rulesContent = readFileSync(rulesPath, "utf-8");
  } catch {
    rulesContent = "Unable to load .cursorrules file.";
  }

  return (
    <>
      <PageBanner title="Cursor Rules" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Working with Cursor guide */}
          <div className="mt-8 space-y-10">
            <section>
              <Lead>
                The Tally Design System is optimised for use with{" "}
                <a
                  href="https://cursor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#2C365D] underline hover:no-underline dark:text-[#7c8cb8]"
                >
                  Cursor
                </a>
                , an AI-powered code editor. This guide explains how to get the best results when building pages and features using the design system.
              </Lead>
            </section>

            <section>
              <H2 className="border-0 pb-0">How it works</H2>
              <P>
                The design system includes a <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">.cursorrules</code> file in the project root. When you open the project in Cursor, this file is automatically read and provides context about:
              </P>
              <Ul>
                <li>Available components and when to use them</li>
                <li>Brand variants and theming</li>
                <li>Page patterns and layouts</li>
                <li>Coding conventions and file structure</li>
              </Ul>
              <P>This means Cursor already understands the design system before you ask it to build anything.</P>
            </section>

            <section>
              <H2 className="border-0 pb-0">Getting started</H2>
              <H3 className="text-lg">1. Open the project in Cursor</H3>
              <P>Open the <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">energy-design-system</code> folder directly in Cursor. The <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800">.cursorrules</code> file will be detected automatically.</P>
              <H3 className="mt-6 text-lg">2. Check the rules are loaded</H3>
              <P>You can verify by asking Cursor:</P>
              <blockquote className="mt-2 border-l-2 border-[#2C365D] pl-4 italic text-gray-700 dark:text-gray-300">
                &quot;What components are available in this design system?&quot;
              </blockquote>
              <P>It should list the components from the rules file.</P>
              <H3 className="mt-6 text-lg">3. Start building</H3>
              <P>When you ask Cursor to create pages or features, it will reference existing components rather than creating new ones.</P>
            </section>

            <section>
              <H2 className="border-0 pb-0">Writing effective prompts</H2>
              <H3 className="text-lg">Be specific about context</H3>
              <P>Always tell Cursor:</P>
              <Ul>
                <li><strong>Which brand</strong> — Tally Glass, Small Market, Large Market, etc.</li>
                <li><strong>Who the user is</strong> — Call center agent, end customer, admin</li>
                <li><strong>Which existing page to reference</strong> — &quot;Follow the pattern from /pages/dashboard&quot;</li>
              </Ul>
              <H3 className="mt-6 text-lg">Example prompts</H3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Good prompt:</p>
                  <blockquote className="mt-1 rounded-lg border border-border bg-white p-4 text-sm dark:border-gray-700 dark:bg-gray-800">
                    Create a new dashboard page for payment history. This is for Tally Glass (call center agents viewing customer accounts). Use Card for the summary, Table for transaction history, and Badge for payment status. Follow the layout from /pages/dashboard.
                  </blockquote>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vague prompt (avoid):</p>
                  <blockquote className="mt-1 rounded-lg border border-border bg-gray-100 p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
                    Make a payments page.
                  </blockquote>
                </div>
              </div>
              <P>The specific prompt will reuse existing components. The vague prompt might create unnecessary new ones.</P>
            </section>

            <section>
              <H2 className="border-0 pb-0">Common tasks</H2>
              <H3 className="text-lg">Creating a new page</H3>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
{`Create a new page for [purpose].

Brand: [Tally Glass / Small Market / Large Market]
User: [Call center agent / Customer / Admin]

The page should show:
- [Content/data requirements]

Use these components:
- [List components]

Follow the pattern from: /pages/[reference-page]`}
              </pre>
              <H3 className="mt-6 text-lg">Adding to an existing page</H3>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
{`Add a [feature] section to /pages/[page-name].

Use the existing [Component] component.
Place it [where on the page].`}
              </pre>
              <H3 className="mt-6 text-lg">Creating a new component</H3>
              <P>Only create new components when nothing existing will work. Ask Cursor to verify first:</P>
              <blockquote className="mt-2 rounded-lg border border-border bg-white p-4 text-sm dark:border-gray-700 dark:bg-gray-800">
                I need [functionality]. Check the existing components — is there something I can use or extend, or do I need a new component?
              </blockquote>
            </section>

            <section>
              <H2 className="border-0 pb-0">Quick reference</H2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                      <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Task</th>
                      <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Prompt pattern</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">New dashboard</td>
                      <td className="px-4 py-3 font-mono text-xs">&quot;Create a dashboard for [purpose], brand: [X], using Card, Table, Charts&quot;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">New form</td>
                      <td className="px-4 py-3 font-mono text-xs">&quot;Create a form for [purpose] using Card for sections, Input/Select for fields&quot;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Add feature</td>
                      <td className="px-4 py-3 font-mono text-xs">&quot;Add [feature] to /pages/[page] using [Component]&quot;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Check components</td>
                      <td className="px-4 py-3 font-mono text-xs">&quot;What existing components should I use for [requirement]?&quot;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Update rules</td>
                      <td className="px-4 py-3 font-mono text-xs">&quot;Update .cursorrules to include the new [Component]&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <H2 className="border-0 pb-0">Related resources</H2>
              <Ul>
                <li><Link href="/components/button" className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]">Components</Link> — Full list of available components</li>
                <li><Link href="/foundation/colour" className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]">Foundation</Link> — Colours, typography, layout, and brand tokens</li>
                <li><Link href="/pages/dashboard" className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]">Pages</Link> — Example page implementations</li>
              </Ul>
            </section>

            {/* The .cursorrules file - visible section */}
            <section className="border-t border-border pt-12 dark:border-gray-700">
              <H2 className="border-0 pb-0">The .cursorrules file</H2>
              <P>
                The following content is what Cursor reads from the project root. It documents all available components, page patterns, foundation tokens, and brand variants.
              </P>
              <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-gray-900 dark:border-gray-700">
                <pre className="p-4 text-sm text-gray-100">
                  <code className="whitespace-pre">{rulesContent}</code>
                </pre>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CursorRulesPage() {
  return (
    <>
      <CursorRulesContent />
    </>
  );
}
