import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import PageBanner from "@/components/PageBanner/PageBanner";

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
          {/* Page description */}
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
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
            </p>
          </div>

          {/* How it works */}
          <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              How it works
            </h2>
            <p className="mb-4 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              The design system includes a{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800 dark:text-gray-200">
                .cursorrules
              </code>{" "}
              file in the project root. When you open the project in Cursor, this file is automatically read and provides context about:
            </p>
            <ul className="max-w-3xl list-disc space-y-2 pl-5 text-base leading-6 text-gray-600 dark:text-gray-400">
              <li>Available components and when to use them</li>
              <li>Brand variants and theming</li>
              <li>Page patterns and layouts</li>
              <li>Coding conventions and file structure</li>
            </ul>
            <p className="mt-4 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              This means Cursor already understands the design system before you ask it to build anything.
            </p>
          </section>

          {/* Getting started */}
          <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Getting started
            </h2>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              1. Open the project in Cursor
            </h3>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              Open the{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800 dark:text-gray-200">
                energy-design-system
              </code>{" "}
              folder directly in Cursor. The{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800 dark:text-gray-200">
                .cursorrules
              </code>{" "}
              file will be detected automatically.
            </p>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              2. Check the rules are loaded
            </h3>
            <p className="mb-2 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              You can verify by asking Cursor:
            </p>
            <blockquote className="mb-6 border-l-2 border-[#2C365D] pl-4 text-base italic text-gray-700 dark:border-[#7c8cb8] dark:text-gray-300">
              &quot;What components are available in this design system?&quot;
            </blockquote>
            <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              It should list the components from the rules file.
            </p>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              3. Start building
            </h3>
            <p className="max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              When you ask Cursor to create pages or features, it will reference existing components rather than creating new ones.
            </p>
          </section>

          {/* Writing effective prompts */}
          <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Writing effective prompts
            </h2>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              Be specific about context
            </h3>
            <p className="mb-4 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              Always tell Cursor:
            </p>
            <ul className="mb-6 max-w-3xl list-disc space-y-2 pl-5 text-base leading-6 text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-gray-100">Which brand</strong> — Tally Glass, Small Market, Large Market, etc.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">Who the user is</strong> — Call center agent, end customer, admin
              </li>
              <li>
                <strong className="text-gray-900 dark:text-gray-100">Which existing page to reference</strong> — &quot;Follow the pattern from /pages/dashboard&quot;
              </li>
            </ul>
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              Example prompts
            </h3>
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">Good prompt:</p>
                <blockquote className="rounded-lg border border-border bg-white p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  Create a new dashboard page for payment history. This is for Tally Glass (call center agents viewing customer accounts). Use Card for the summary, Table for transaction history, and Badge for payment status. Follow the layout from /pages/dashboard.
                </blockquote>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">Vague prompt (avoid):</p>
                <blockquote className="rounded-lg border border-border bg-gray-100 p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
                  Make a payments page.
                </blockquote>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              The specific prompt will reuse existing components. The vague prompt might create unnecessary new ones.
            </p>
          </section>

          {/* Common tasks */}
          <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Common tasks
            </h2>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              Creating a new page
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-lg border border-border bg-gray-900 p-4 text-sm text-gray-100 dark:border-gray-700">
              <code className="whitespace-pre">{`Create a new page for [purpose].

Brand: [Tally Glass / Small Market / Large Market]
User: [Call center agent / Customer / Admin]

The page should show:
- [Content/data requirements]

Use these components:
- [List components]

Follow the pattern from: /pages/[reference-page]`}</code>
            </pre>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              Adding to an existing page
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-lg border border-border bg-gray-900 p-4 text-sm text-gray-100 dark:border-gray-700">
              <code className="whitespace-pre">{`Add a [feature] section to /pages/[page-name].

Use the existing [Component] component.
Place it [where on the page].`}</code>
            </pre>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              Creating a new component
            </h3>
            <p className="mb-4 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              Only create new components when nothing existing will work. Ask Cursor to verify first:
            </p>
            <blockquote className="rounded-lg border border-border bg-white p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              I need [functionality]. Check the existing components — is there something I can use or extend, or do I need a new component?
            </blockquote>
          </section>

          {/* Quick reference */}
          <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Quick reference
            </h2>
            <div className="overflow-hidden rounded-lg border border-border bg-white dark:border-gray-700 dark:bg-gray-800">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50/80 dark:border-gray-700 dark:bg-gray-800/80">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Task
                    </th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Prompt pattern
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">New dashboard</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                      &quot;Create a dashboard for [purpose], brand: [X], using Card, Table, Charts&quot;
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">New form</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                      &quot;Create a form for [purpose] using Card for sections, Input/Select for fields&quot;
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Add feature</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                      &quot;Add [feature] to /pages/[page] using [Component]&quot;
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Check components</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                      &quot;What existing components should I use for [requirement]?&quot;
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Update rules</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                      &quot;Update .cursorrules to include the new [Component]&quot;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Related resources */}
          <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Related resources
            </h2>
            <ul className="max-w-3xl list-disc space-y-2 pl-5 text-base leading-6 text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/components/button" className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]">
                  Components
                </Link>{" "}
                — Full list of available components
              </li>
              <li>
                <Link href="/foundation/colour" className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]">
                  Foundation
                </Link>{" "}
                — Colours, typography, layout, and brand tokens
              </li>
              <li>
                <Link href="/pages/dashboard" className="font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]">
                  Pages
                </Link>{" "}
                — Example page implementations
              </li>
            </ul>
          </section>

          {/* The .cursorrules file */}
          <section className="mb-16 border-t border-border pt-16 dark:border-gray-700">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              The .cursorrules file
            </h2>
            <p className="mb-4 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
              The following content is what Cursor reads from the project root. It documents all available components, page patterns, foundation tokens, and brand variants.
            </p>
            <div className="overflow-hidden rounded-lg border border-border bg-gray-900 dark:border-gray-700">
              <pre className="overflow-x-auto p-4 text-sm text-gray-100">
                <code className="whitespace-pre">{rulesContent}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default function CursorRulesPage() {
  return <CursorRulesContent />;
}
