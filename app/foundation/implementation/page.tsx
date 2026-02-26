"use client";

import { useState } from "react";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { Icon } from "@/components/ui/icon";

const ROLLOUT_PHASES = [
  {
    phase: 1,
    title: "Try New Feature",
    icon: "toggle_on",
    color: "#00D2A2",
    status: "Opt-in",
    duration: "Launch → SteerCo review",
    description:
      "Users see a toggle inviting them to try the new TDS-powered interface. The old view remains the default. Users can switch back at any time with a single click.",
    userExperience: [
      "A prominent 'Try new feature' toggle appears in the UI",
      "Clicking it switches to the new TDS design for that feature",
      "A brief explainer tells the user what's changed and why",
      "The user can revert to the old view instantly — no data loss, no disruption",
      "Their preference is remembered across sessions",
    ],
    devActions: [
      "Implement the new TDS feature behind a feature flag",
      "Build the toggle UI component (see code tab for pattern)",
      "Wire up preference storage (localStorage or user profile API)",
      "Ensure both old and new views remain fully functional",
      "Track adoption metrics: toggle-on rate, revert rate, time spent",
    ],
    keyPrinciple:
      "Zero pressure. Users discover the new design on their own terms. The old view is still the default — we're simply offering a preview.",
  },
  {
    phase: 2,
    title: "Switch to Classic",
    icon: "swap_horiz",
    color: "#2C365D",
    status: "Opt-out",
    duration: "SteerCo decision → sunset date",
    description:
      "The new TDS design becomes the default experience. Users who prefer the old view can switch to 'Classic' mode via a toggle, but the new design is now the primary interface.",
    userExperience: [
      "The new TDS design is now the default for all users",
      "A 'Switch to Classic' option is available in settings or the UI",
      "Users who were already on the new design see no change",
      "Users on the old view are transitioned with a friendly notification",
      "The classic toggle is clearly labelled as a temporary option",
    ],
    devActions: [
      "Flip the feature flag default to the new TDS design",
      "Rename the toggle from 'Try new feature' to 'Switch to Classic'",
      "Add a sunset notice: 'Classic view will be retired on [date]'",
      "Continue monitoring adoption and collecting feedback",
      "Begin deprecation warnings in the classic code path",
    ],
    keyPrinciple:
      "Confident default. The new design has proven itself during Phase 1. We're now making it the standard while giving a safety net for users who need more time.",
  },
  {
    phase: 3,
    title: "Classic Retired",
    icon: "check_circle",
    color: "#008000",
    status: "Complete",
    duration: "After sunset period",
    description:
      "The Classic view is removed. All users are on the TDS design. The feature flag and toggle infrastructure can be cleaned up.",
    userExperience: [
      "All users are on the new TDS design — one consistent experience",
      "The 'Switch to Classic' toggle is removed",
      "Any remaining Classic users are migrated automatically",
      "A brief notification confirms the transition is complete",
    ],
    devActions: [
      "Remove the feature flag and toggle infrastructure",
      "Delete the old (Classic) view code",
      "Clean up any dual-rendering logic",
      "Archive adoption metrics for the rollout retrospective",
      "Update documentation to reflect the new baseline",
    ],
    keyPrinciple:
      "Clean slate. One codebase, one experience, no toggle debt. The TDS design is the product.",
  },
];

const TOGGLE_GUIDELINES = [
  {
    icon: "visibility",
    title: "Make the toggle discoverable",
    description:
      "Place the toggle where users will naturally see it — in the feature area itself, not buried in settings. During Phase 1, a banner or inline prompt works best.",
  },
  {
    icon: "info",
    title: "Explain what's changing",
    description:
      "A short, one-sentence description alongside the toggle helps users understand the value. Avoid jargon — focus on the benefit (e.g. 'Faster navigation with the new sidebar').",
  },
  {
    icon: "undo",
    title: "Always allow instant revert",
    description:
      "The toggle must switch views immediately with no data loss. Users should never feel trapped in a view they didn't choose. Revert should be just as easy as opting in.",
  },
  {
    icon: "save",
    title: "Remember the preference",
    description:
      "Store the user's choice (localStorage for anonymous, user profile for authenticated). When they return, they should see the view they last chose.",
  },
  {
    icon: "analytics",
    title: "Track adoption, not just clicks",
    description:
      "Measure toggle-on rate, revert rate, time-to-revert, and daily active users on each view. These metrics inform the SteerCo decision to move to Phase 2.",
  },
  {
    icon: "schedule",
    title: "Communicate timelines clearly",
    description:
      "In Phase 2, show a clear sunset date for Classic view. Give users enough notice (typically 4–8 weeks) before the toggle is removed in Phase 3.",
  },
];

const SCOPE_STRATEGIES = [
  {
    title: "By Feature",
    icon: "extension",
    description:
      "Roll out one feature at a time. Each feature gets its own toggle. Users might be on the new sidebar but still see the old table view.",
    example:
      "Week 1: New navigation bar → Week 3: New data tables → Week 6: New dashboard layout",
    pros: ["Smallest blast radius", "Easy to isolate issues", "Independent timelines per feature"],
    cons: ["Users may see mixed old/new UI temporarily", "More toggles to manage"],
  },
  {
    title: "By Page",
    icon: "web",
    description:
      "Roll out entire pages at once. A whole screen switches from old to new. Users get a consistent experience within each page.",
    example:
      "Phase 1: Settings page → Phase 2: Dashboard → Phase 3: Reports",
    pros: ["Consistent experience per page", "Fewer toggles", "Easier to test end-to-end"],
    cons: ["Larger change per rollout", "More QA effort per phase"],
  },
  {
    title: "By User Group",
    icon: "group",
    description:
      "Roll out to specific user groups first (e.g. internal users, beta testers, then general availability). Everyone in the group gets the full new experience.",
    example:
      "Internal team → Power users → All users",
    pros: ["Real-world feedback before GA", "Controlled risk", "Champions can help onboard others"],
    cons: ["Requires user segmentation", "Support team needs to handle two versions"],
  },
];

function PhaseCard({ phase }: { phase: (typeof ROLLOUT_PHASES)[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-800">
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: phase.color }}
      />

      <div className="p-6 pl-7">
        <div className="mb-4 flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${phase.color}15` }}
          >
            <Icon name={phase.icon} size={24} style={{ color: phase.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: phase.color }}
              >
                {phase.phase}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {phase.title}
              </h3>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${phase.color}15`,
                  color: phase.color,
                }}
              >
                {phase.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Icon name="schedule" size={14} className="mr-1 inline align-text-bottom" />
              {phase.duration}
            </p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {phase.description}
        </p>

        <div className="mb-4 rounded-lg border border-dashed border-border bg-gray-50/50 p-4 dark:border-gray-600 dark:bg-gray-700/30">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <Icon name="lightbulb" size={14} />
            Key Principle
          </p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {phase.keyPrinciple}
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm font-medium text-[#2C365D] transition-colors hover:text-[#2C365D]/80 dark:text-[#80B3FF] dark:hover:text-[#80B3FF]/80"
        >
          <Icon name={expanded ? "expand_less" : "expand_more"} size={18} />
          {expanded ? "Show less" : "View details"}
        </button>

        {expanded && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <Icon name="person" size={14} className="mr-1 inline align-text-bottom" />
                User Experience
              </p>
              <ul className="space-y-1.5">
                {phase.userExperience.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0" style={{ color: phase.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <Icon name="code" size={14} className="mr-1 inline align-text-bottom" />
                Developer Actions
              </p>
              <ul className="space-y-1.5">
                {phase.devActions.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Icon name="arrow_forward" size={16} className="mt-0.5 shrink-0 text-gray-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PhaseTimeline() {
  return (
    <div className="flex flex-col gap-0">
      {ROLLOUT_PHASES.map((phase, i) => (
        <div key={phase.phase} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: phase.color }}
            >
              {phase.phase}
            </div>
            {i < ROLLOUT_PHASES.length - 1 && (
              <div className="h-16 w-px bg-gray-300 dark:bg-gray-600" />
            )}
          </div>
          <div className="pb-8">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {phase.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {phase.status} · {phase.duration}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TogglePreview() {
  const [isNewView, setIsNewView] = useState(false);
  const [phase, setPhase] = useState<1 | 2>(1);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-border bg-gray-50/80 px-6 py-3 dark:border-gray-700 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Interactive Preview
          </p>
          <div className="flex gap-1 rounded-lg border border-border bg-white p-0.5 dark:border-gray-600 dark:bg-gray-700">
            <button
              onClick={() => { setPhase(1); setIsNewView(false); }}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                phase === 1
                  ? "bg-[#2C365D] text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Phase 1
            </button>
            <button
              onClick={() => { setPhase(2); setIsNewView(true); }}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                phase === 2
                  ? "bg-[#2C365D] text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Phase 2
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mx-auto max-w-md">
          {/* Toggle UI */}
          <div
            className={`rounded-lg border-2 p-4 transition-all ${
              isNewView
                ? "border-[#00D2A2]/30 bg-[#00D2A2]/5"
                : "border-border bg-gray-50 dark:border-gray-600 dark:bg-gray-700/30"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {phase === 1 ? (
                    <>
                      <Icon name="auto_awesome" size={16} className="mr-1.5 inline align-text-bottom text-[#00D2A2]" />
                      Try the new navigation
                    </>
                  ) : (
                    <>
                      <Icon name="swap_horiz" size={16} className="mr-1.5 inline align-text-bottom text-[#2C365D] dark:text-[#80B3FF]" />
                      {isNewView ? "You're using the new navigation" : "Switch to Classic navigation"}
                    </>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {phase === 1
                    ? "Faster, cleaner navigation with collapsible sections. You can switch back anytime."
                    : isNewView
                      ? "Classic view will be retired on 30 June 2026."
                      : "You're viewing the classic navigation. The new version is now the default."}
                </p>
              </div>
              <button
                onClick={() => setIsNewView(!isNewView)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  isNewView ? "bg-[#00D2A2]" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    isNewView ? "translate-x-[22px]" : "translate-x-[2px]"
                  } mt-[2px]`}
                />
              </button>
            </div>
          </div>

          {/* Simulated content */}
          <div className="mt-4 rounded-lg border border-border bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/30">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              {isNewView ? "New TDS View" : "Classic View"}
            </p>
            <div className="space-y-2">
              {isNewView ? (
                <>
                  <div className="h-3 w-full rounded-full bg-[#00D2A2]/20" />
                  <div className="h-3 w-4/5 rounded-full bg-[#2C365D]/15" />
                  <div className="h-3 w-3/5 rounded-full bg-[#00D2A2]/10" />
                </>
              ) : (
                <>
                  <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-600" />
                  <div className="h-3 w-4/5 rounded-full bg-gray-200 dark:bg-gray-600" />
                  <div className="h-3 w-3/5 rounded-full bg-gray-200 dark:bg-gray-600" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignTab() {
  return (
    <div className="space-y-16">
      {/* Overview */}
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Incremental Rollout Strategy
        </h2>
        <p className="mb-4 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          You don&apos;t need to launch the full TDS redesign in one go. The
          incremental rollout strategy lets you ship new TDS features
          progressively, giving users time to adjust and giving your team the
          chance to gather feedback at every stage.
        </p>
        <p className="max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Every rollout follows a three-phase pattern: <strong className="text-gray-800 dark:text-gray-200">Try New Feature</strong> (opt-in) →{" "}
          <strong className="text-gray-800 dark:text-gray-200">Switch to Classic</strong> (opt-out) →{" "}
          <strong className="text-gray-800 dark:text-gray-200">Classic Retired</strong> (complete).
          The transition between phases is controlled by SteerCo based on adoption metrics and user feedback.
        </p>
      </section>

      {/* Timeline overview */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          The Three Phases
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Each phase shifts the balance from old to new. Users always have
          control — only the default changes.
        </p>

        <div className="grid gap-8 xl:grid-cols-[auto_1fr]">
          <PhaseTimeline />
          <div className="space-y-6">
            {ROLLOUT_PHASES.map((phase) => (
              <PhaseCard key={phase.phase} phase={phase} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive preview */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Toggle Behaviour Preview
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          See how the toggle looks and behaves in each phase. Switch between
          Phase 1 and Phase 2 to see the copy and framing change.
        </p>
        <TogglePreview />
      </section>

      {/* Toggle guidelines */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Toggle Guidelines
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Follow these guidelines when implementing the feature toggle in your
          product. A well-implemented toggle builds trust and encourages adoption.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOGGLE_GUIDELINES.map((guideline) => (
            <div
              key={guideline.title}
              className="rounded-xl border border-border bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2C365D]/10 dark:bg-[#2C365D]/30">
                  <Icon
                    name={guideline.icon}
                    size={18}
                    className="text-[#2C365D] dark:text-[#80B3FF]"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {guideline.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {guideline.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Scope strategies */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Rollout Scope Strategies
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Choose how granularly to roll out your TDS changes. Each strategy has
          trade-offs — pick the one that suits your product&apos;s complexity and
          user base.
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          {SCOPE_STRATEGIES.map((strategy) => (
            <div
              key={strategy.title}
              className="rounded-xl border border-border bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2C365D]/10 dark:bg-[#2C365D]/30">
                  <Icon
                    name={strategy.icon}
                    size={20}
                    className="text-[#2C365D] dark:text-[#80B3FF]"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {strategy.title}
                </h3>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {strategy.description}
              </p>
              <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/40">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Example</p>
                <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                  {strategy.example}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1 text-xs font-medium text-green-700 dark:text-green-400">Pros</p>
                  <ul className="space-y-1">
                    {strategy.pros.map((pro) => (
                      <li key={pro} className="flex gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <Icon name="add" size={12} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-amber-700 dark:text-amber-400">Cons</p>
                  <ul className="space-y-1">
                    {strategy.cons.map((con) => (
                      <li key={con} className="flex gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <Icon name="remove" size={12} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Decision flow */}
      <section className="border-t border-border pt-16 pb-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Phase Transition Checklist
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Before requesting a phase transition from SteerCo, ensure your product
          meets these criteria.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Phase 1 → 2 */}
          <div className="rounded-xl border border-border bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00D2A2] text-xs font-bold text-white">
                  1
                </span>
                <Icon name="arrow_forward" size={16} className="text-gray-400" />
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2C365D] text-xs font-bold text-white">
                  2
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Ready for Default
              </h3>
            </div>
            <ul className="space-y-2">
              {[
                "Adoption rate above agreed threshold (e.g. 30%+ of active users)",
                "Revert rate below threshold (e.g. <10% switch back within 7 days)",
                "No critical bugs in the new view",
                "Support team briefed on the new experience",
                "Sunset date agreed with SteerCo",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="check_box_outline_blank" size={16} className="mt-0.5 shrink-0 text-gray-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 2 → 3 */}
          <div className="rounded-xl border border-border bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2C365D] text-xs font-bold text-white">
                  2
                </span>
                <Icon name="arrow_forward" size={16} className="text-gray-400" />
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#008000] text-xs font-bold text-white">
                  3
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Ready to Retire Classic
              </h3>
            </div>
            <ul className="space-y-2">
              {[
                "Classic usage below agreed threshold (e.g. <5% of active users)",
                "Sunset notice period has elapsed (typically 4–8 weeks)",
                "All critical feedback from Classic users addressed",
                "Migration plan for remaining Classic users documented",
                "Code cleanup plan ready (remove old views, flags, toggles)",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="check_box_outline_blank" size={16} className="mt-0.5 shrink-0 text-gray-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function CodeTab() {
  return (
    <div className="space-y-16">
      {/* Feature flag pattern */}
      <section>
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Feature Flag Pattern
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Use a simple feature flag hook to control which view renders. The
          flag&apos;s default value changes between phases.
        </p>
        <div className="overflow-hidden rounded-xl border border-border bg-gray-900 dark:border-gray-700">
          <div className="border-b border-gray-700 px-4 py-2">
            <span className="text-xs font-medium text-gray-400">hooks/useFeatureFlag.ts</span>
          </div>
          <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-gray-300">
            <code>{`import { useState, useEffect } from "react";

type FeatureFlag = {
  key: string;
  defaultValue: boolean;  // Phase 1: false, Phase 2: true
};

export function useFeatureFlag({ key, defaultValue }: FeatureFlag) {
  const [enabled, setEnabled] = useState(defaultValue);

  useEffect(() => {
    const stored = localStorage.getItem(\`tds-feature-\${key}\`);
    if (stored !== null) {
      setEnabled(stored === "true");
    }
  }, [key]);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(\`tds-feature-\${key}\`, String(next));
  };

  return { enabled, toggle };
}`}</code>
          </pre>
        </div>
      </section>

      {/* Toggle component */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Toggle Component
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          A reusable toggle banner that handles both Phase 1 (&quot;Try new
          feature&quot;) and Phase 2 (&quot;Switch to Classic&quot;) copy
          automatically.
        </p>
        <div className="overflow-hidden rounded-xl border border-border bg-gray-900 dark:border-gray-700">
          <div className="border-b border-gray-700 px-4 py-2">
            <span className="text-xs font-medium text-gray-400">components/TdsFeatureToggle.tsx</span>
          </div>
          <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-gray-300">
            <code>{`import Switch from "@/components/Switch/Switch";

type TdsFeatureToggleProps = {
  featureName: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  phase: 1 | 2;
  sunsetDate?: string;  // Only for Phase 2
};

export function TdsFeatureToggle({
  featureName,
  description,
  enabled,
  onToggle,
  phase,
  sunsetDate,
}: TdsFeatureToggleProps) {
  const label =
    phase === 1
      ? \`Try the new \${featureName}\`
      : enabled
        ? \`You're using the new \${featureName}\`
        : \`Switch to Classic \${featureName}\`;

  const hint =
    phase === 1
      ? description + " You can switch back anytime."
      : enabled && sunsetDate
        ? \`Classic view will be retired on \${sunsetDate}.\`
        : "You're viewing the classic version. The new version is now the default.";

  return (
    <div className={\`rounded-lg border-2 p-4 transition-all \${
      enabled
        ? "border-[#00D2A2]/30 bg-[#00D2A2]/5"
        : "border-border bg-gray-50"
    }\`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="mt-0.5 text-xs text-gray-500">{hint}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
    </div>
  );
}`}</code>
          </pre>
        </div>
      </section>

      {/* Usage example */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Usage in a Page
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Wrap your old and new views in a conditional based on the feature
          flag. The toggle component goes at the top of the feature area.
        </p>
        <div className="overflow-hidden rounded-xl border border-border bg-gray-900 dark:border-gray-700">
          <div className="border-b border-gray-700 px-4 py-2">
            <span className="text-xs font-medium text-gray-400">app/pages/my-product/page.tsx</span>
          </div>
          <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-gray-300">
            <code>{`"use client";

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { TdsFeatureToggle } from "@/components/TdsFeatureToggle";
import { NewNavigationBar } from "./NewNavigationBar";
import { ClassicNavigationBar } from "./ClassicNavigationBar";

const CURRENT_PHASE = 1;  // Change to 2 when SteerCo approves

export default function MyProductPage() {
  const { enabled, toggle } = useFeatureFlag({
    key: "new-navigation",
    defaultValue: CURRENT_PHASE >= 2,  // Phase 1: off, Phase 2: on
  });

  return (
    <div>
      <TdsFeatureToggle
        featureName="navigation"
        description="Faster, cleaner navigation with collapsible sections."
        enabled={enabled}
        onToggle={toggle}
        phase={CURRENT_PHASE}
        sunsetDate="30 June 2026"
      />

      {enabled ? <NewNavigationBar /> : <ClassicNavigationBar />}

      {/* Rest of the page — unchanged */}
    </div>
  );
}`}</code>
          </pre>
        </div>
      </section>

      {/* Phase transition */}
      <section className="border-t border-border pt-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Moving Between Phases
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Transitioning between phases requires minimal code changes. Here&apos;s
          what changes at each step.
        </p>
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border bg-gray-900 dark:border-gray-700">
            <div className="border-b border-gray-700 px-4 py-2">
              <span className="text-xs font-medium text-gray-400">Phase 1 → Phase 2: Change the constant</span>
            </div>
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-gray-300">
              <code>{`// Before (Phase 1)
const CURRENT_PHASE = 1;

// After (Phase 2) — that's it
const CURRENT_PHASE = 2;`}</code>
            </pre>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-gray-900 dark:border-gray-700">
            <div className="border-b border-gray-700 px-4 py-2">
              <span className="text-xs font-medium text-gray-400">Phase 2 → Phase 3: Remove toggle infrastructure</span>
            </div>
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-gray-300">
              <code>{`// Before (Phase 2)
export default function MyProductPage() {
  const { enabled, toggle } = useFeatureFlag({ ... });
  return (
    <div>
      <TdsFeatureToggle ... />
      {enabled ? <NewNavigationBar /> : <ClassicNavigationBar />}
    </div>
  );
}

// After (Phase 3) — clean and simple
export default function MyProductPage() {
  return (
    <div>
      <NewNavigationBar />
    </div>
  );
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="border-t border-border pt-16 pb-16">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Tracking Adoption
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Log toggle events to your analytics platform so SteerCo has the data
          they need to approve phase transitions.
        </p>
        <div className="overflow-hidden rounded-xl border border-border bg-gray-900 dark:border-gray-700">
          <div className="border-b border-gray-700 px-4 py-2">
            <span className="text-xs font-medium text-gray-400">Recommended events to track</span>
          </div>
          <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-gray-300">
            <code>{`// When user toggles the feature on
analytics.track("tds_feature_enabled", {
  feature: "new-navigation",
  phase: CURRENT_PHASE,
  timestamp: new Date().toISOString(),
});

// When user reverts to classic
analytics.track("tds_feature_disabled", {
  feature: "new-navigation",
  phase: CURRENT_PHASE,
  timeSpentInNewView: durationMs,
});

// Daily active users per view (server-side)
// → "tds_daily_view_split" { feature, newViewUsers, classicUsers }`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}

export default function ImplementationPage() {
  const [activeTab, setActiveTab] = useState("design");
  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Implementation Guide" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              A guide for product teams on how to launch TDS designs
              incrementally. You don&apos;t need to ship everything at once — roll
              out features progressively using a <strong className="text-gray-900 dark:text-gray-100">Try New Feature</strong> toggle,
              graduate to <strong className="text-gray-900 dark:text-gray-100">Switch to Classic</strong>, and eventually retire the old view.
            </p>
          </div>

          {activeTab === "design" && <DesignTab />}
          {activeTab === "code" && <CodeTab />}
        </div>
      </div>
    </>
  );
}
