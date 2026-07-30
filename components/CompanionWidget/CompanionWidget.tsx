"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { Icon } from "@/components/ui/icon";
import {
  type CompanionDoc,
  type CompanionDocCategory,
  type CompanionDocsProvider,
  localCompanionDocsProvider,
} from "@/lib/companion-docs";
import { cn } from "@/lib/utils";

type CompanionMode = "Guide" | "Assist" | "Act";
type CompanionTab = "chat" | "docs";
type PanelSize = { width: number; height: number };
type DemoConversation =
  | { kind: "bill"; query: string }
  | { kind: "act-email"; query: string; email: string };
type ActEmailStep = "confirm" | "update" | "done";

const BILL_DEMO_PROMPT = "can you show me where to find the bill";
const ACT_EMAIL_DEMO_PROMPT =
  "can you change the email address of primary customer to test@test.com";
const ACT_EMAIL_DEMO_ADDRESS = "test@test.com";
const CHAT_RESPONSE_DELAY_MS = 1400;
const ACT_ORANGE = "#E65100";
const ACT_CARD = "rounded-xl border border-[#BFD9F2] bg-[#EAF4FC] p-4 text-sm text-[#2C365D]";

function useDelayedReveal(delayMs = CHAT_RESPONSE_DELAY_MS) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return ready;
}

function ThinkingIndicator() {
  return (
    <div
      aria-live="polite"
      aria-label="Companion is thinking"
      className="flex w-fit items-center gap-1.5 rounded-xl border border-[#DEDEE1] bg-white px-3.5 py-3 dark:border-gray-700 dark:bg-white/[0.06]"
    >
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#595767]"
          style={{ animationDelay: `${dot * 160}ms` }}
        />
      ))}
    </div>
  );
}

const CATEGORY_CONFIG: Record<
  CompanionDocCategory,
  { label: string; border: string; dot: string }
> = {
  "account-billing": {
    label: "Account and Billing",
    border: "border-l-[#0074C4]",
    dot: "bg-[#0074C4]",
  },
  payments: {
    label: "Payments",
    border: "border-l-[#00D2A2]",
    dot: "bg-[#00D2A2]",
  },
  "hardship-compliance": {
    label: "Hardship and Compliance",
    border: "border-l-[#C40000]",
    dot: "bg-[#C40000]",
  },
};

const MODE_CONFIG: Record<
  CompanionMode,
  { icon: string; description: string }
> = {
  Guide: {
    icon: "menu_book",
    description: "Step-by-step answers and walkthroughs",
  },
  Assist: {
    icon: "auto_awesome",
    description: "Navigate and prefill — you confirm",
  },
  Act: {
    icon: "bolt",
    description: "Work in chat — you review first",
  },
};

export interface CompanionWidgetProps {
  docsProvider?: CompanionDocsProvider;
}

export default function CompanionWidget({
  docsProvider = localCompanionDocsProvider,
}: CompanionWidgetProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CompanionTab>("chat");
  const [selectedDoc, setSelectedDoc] = useState<CompanionDoc | null>(null);
  const [docs, setDocs] = useState<CompanionDoc[]>([]);
  const [docsState, setDocsState] = useState<"loading" | "ready" | "error">("loading");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState<DemoConversation[]>([]);
  const [mode, setMode] = useState<CompanionMode>("Guide");
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [size, setSize] = useState<PanelSize>({ width: 460, height: 640 });
  const modeMenuRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setDocsState("loading");
    docsProvider
      .listDocs()
      .then((result) => {
        if (!active) return;
        setDocs(result);
        setDocsState("ready");
      })
      .catch(() => {
        if (active) setDocsState("error");
      });
    return () => {
      active = false;
    };
  }, [docsProvider]);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!modeMenuRef.current?.contains(event.target as Node)) {
        setModeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  useEffect(() => {
    if (!chatScrollRef.current) return;
    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    const timer = window.setTimeout(() => {
      if (!chatScrollRef.current) return;
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }, CHAT_RESPONSE_DELAY_MS + 80);
    return () => window.clearTimeout(timer);
  }, [conversations]);

  const filteredDocs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return docs;
    return docs.filter((doc) =>
      [doc.title, doc.summary, CATEGORY_CONFIG[doc.category].label]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [docs, search]);

  const startResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    const start = {
      x: event.clientX,
      y: event.clientY,
      width: size.width,
      height: size.height,
    };

    const move = (pointerEvent: PointerEvent) => {
      const maxWidth = Math.max(320, window.innerWidth - 48);
      const maxHeight = Math.max(380, window.innerHeight - 48);
      setSize({
        width: Math.min(maxWidth, Math.max(320, start.width + start.x - pointerEvent.clientX)),
        height: Math.min(maxHeight, Math.max(380, start.height + start.y - pointerEvent.clientY)),
      });
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    event.preventDefault();
  };

  const switchTab = (tab: CompanionTab) => {
    setActiveTab(tab);
    setSelectedDoc(null);
  };

  const submitQuery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();
    if (!nextQuery) return;

    const normalized = nextQuery.toLowerCase().replace(/[?.!]+$/g, "").trim();
    let nextConversation: DemoConversation | null = null;

    if (
      mode === "Act" &&
      (normalized.includes("change the email") ||
        normalized.includes("change customer email") ||
        normalized === ACT_EMAIL_DEMO_PROMPT)
    ) {
      nextConversation = {
        kind: "act-email",
        query: nextQuery,
        email: ACT_EMAIL_DEMO_ADDRESS,
      };
    } else if (
      normalized === BILL_DEMO_PROMPT ||
      normalized.includes("where to find the bill") ||
      normalized.includes("show me where to find the bill")
    ) {
      nextConversation = { kind: "bill", query: nextQuery };
    }

    if (nextConversation) {
      setConversations((current) => {
        if (current.some((item) => item.kind === nextConversation!.kind)) {
          return current;
        }
        return [...current, nextConversation!];
      });
    }

    setQuery("");
  };

  if (!open) {
    return (
      <Button
        type="button"
        data-companion-widget=""
        onClick={() => setOpen(true)}
        aria-label="Open Companion"
        className="fixed bottom-[1.5rem] right-[1.5rem] z-[70] !h-auto !rounded-full !border-0 !bg-transparent !p-0 !shadow-none hover:-translate-y-0.5 hover:!bg-transparent"
      >
        <Image
          src="/CompanionLogoOrange.png"
          alt="Companion"
          width={128}
          height={42}
          className="h-[34px] w-auto"
        />
      </Button>
    );
  }

  return (
    <section
      aria-label="Companion"
      data-companion-widget=""
      className="fixed bottom-[1.5rem] right-[1.5rem] z-[70] flex max-h-[calc(100vh-48px)] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-xl border border-[#DEDEE1] bg-[#F9F9FB] text-[#181B25] shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100"
      style={{ width: size.width, height: size.height }}
    >
      <button
        type="button"
        onPointerDown={startResize}
        aria-label="Resize companion panel"
        className="absolute left-0 top-0 z-20 flex h-6 w-6 cursor-nwse-resize items-start justify-start p-1.5 text-[#595767]/50 transition-colors hover:text-[#2C365D] dark:text-white/50 dark:hover:text-white"
      >
        <Icon name="drag_handle" size={13} className="-rotate-45" />
      </button>

      <header className="flex min-h-14 shrink-0 items-center justify-between border-b border-[#DEDEE1] bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center pl-2">
          <Image
            src="/CompanionLogoOrange.png"
            alt="Companion"
            width={128}
            height={42}
            className="h-7 w-auto"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Usage"
            aria-label="Usage"
            className="rounded-lg p-2 text-[#595767] transition-colors hover:bg-[#F3F4F6] hover:text-[#2C365D] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Icon name="bar_chart" size={18} />
          </button>
          <button
            type="button"
            title="Settings"
            aria-label="Settings"
            className="rounded-lg p-2 text-[#595767] transition-colors hover:bg-[#F3F4F6] hover:text-[#2C365D] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Icon name="settings" size={18} />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            title="Close"
            aria-label="Close companion"
            className="rounded-lg p-2 text-[#595767] transition-colors hover:bg-[#F3F4F6] hover:text-[#2C365D] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
      </header>

      <div className="flex shrink-0 gap-1 border-b border-[#DEDEE1] bg-white px-4 pt-2 dark:border-gray-700 dark:bg-gray-800">
        {(["chat", "docs"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => switchTab(tab)}
            className={cn(
              "border-b-2 px-3.5 py-2 text-sm font-semibold capitalize transition-colors",
              activeTab === tab
                ? "border-[#2C365D] text-[#2C365D] dark:border-[#00D2A2] dark:text-white"
                : "border-transparent text-[#595767] hover:text-[#2C365D] dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div ref={chatScrollRef} className="min-h-0 flex-1 overflow-y-auto p-4">
        {activeTab === "chat" ? (
          conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.map((conversation) =>
                conversation.kind === "bill" ? (
                  <BillDemoConversation key="bill" query={conversation.query} />
                ) : (
                  <ActEmailDemoConversation
                    key="act-email"
                    query={conversation.query}
                    email={conversation.email}
                  />
                )
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#DEDEE1] bg-white p-5 dark:border-gray-700 dark:bg-white/[0.06]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#00D2A2]/15 text-[#008000] dark:text-[#00D2A2]">
                <Icon name="auto_awesome" size={19} />
              </div>
              <h2 className="text-base font-semibold">Welcome</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                Ask me anything about your processes. I can help with:
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Step-by-step process guidance",
                  "Compliance and regulatory requirements",
                  "State-specific variations",
                  "System navigation",
                  "Escalation paths",
                ].map((capability) => (
                  <li key={capability} className="flex items-center gap-2 text-sm">
                    <Icon name="check" size={16} className="text-[#00A984]" />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          )
        ) : selectedDoc ? (
          <DocDetail doc={selectedDoc} onBack={() => setSelectedDoc(null)} />
        ) : (
          <DocsList
            docs={filteredDocs}
            state={docsState}
            search={search}
            onSearchChange={setSearch}
            onSelect={setSelectedDoc}
          />
        )}
      </div>

      {!selectedDoc && (
        <form
          className="mx-4 mb-4 flex shrink-0 items-center gap-2 rounded-lg border border-[#DEDEE1] bg-white py-1.5 pl-3 pr-1.5 dark:border-gray-700 dark:bg-white/[0.06]"
          onSubmit={submitQuery}
        >
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask about processes or navigation…"
            aria-label="Ask Companion"
            className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
          />
          <div ref={modeMenuRef} className="relative shrink-0">
            {modeMenuOpen && (
              <div className="absolute bottom-[calc(100%+10px)] right-0 w-64 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-gray-800">
                {(Object.keys(MODE_CONFIG) as CompanionMode[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setMode(option);
                      setModeMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.05]",
                      mode === option && "bg-[#00D2A2]/10"
                    )}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#008f6f] dark:text-[#00D2A2]">
                      <Icon name={MODE_CONFIG[option].icon} size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{option}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-gray-500 dark:text-slate-400">
                        {MODE_CONFIG[option].description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => setModeMenuOpen((current) => !current)}
              aria-expanded={modeMenuOpen}
              className={cn(
                "flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors dark:bg-white/[0.08] dark:text-slate-300",
                modeMenuOpen && "bg-[#00D2A2]/15 text-[#008f6f] dark:text-[#00D2A2]"
              )}
            >
              <Icon name={MODE_CONFIG[mode].icon} size={14} />
              {mode}
              <Icon name={modeMenuOpen ? "expand_more" : "expand_less"} size={14} />
            </button>
          </div>
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            className="!h-8 !w-8 !shrink-0 !rounded-full !border-0 !bg-[#00D2A2] !p-0 text-[#2C365D]"
          >
            <Icon name="send" size={16} />
          </Button>
        </form>
      )}
    </section>
  );
}

function BillDemoConversation({ query }: { query: string }) {
  const ready = useDelayedReveal();
  const sources = [
    "Processes/Bill Enquiry",
    "Quick Reference Cards",
    "System Guide/Tally Glass (Customer View)",
    "Processes/Back Billing Enquiry",
  ];

  return (
    <div className="space-y-3">
      <div className="ml-auto w-fit max-w-[85%] rounded-lg bg-[#2C365D] px-4 py-3 text-sm text-white">
        {query}
      </div>

      {!ready ? (
        <ThinkingIndicator />
      ) : (
        <article className="rounded-xl border border-[#DEDEE1] bg-white p-4 text-sm leading-relaxed dark:border-gray-700 dark:bg-white/[0.06]">
          <p>To find the bill for the customer account you are viewing, follow these steps:</p>

          <ol className="mt-3 list-decimal space-y-3 pl-5">
            <li>
              <strong className="text-[#2C365D] dark:text-slate-100">
                Navigate to the Financial Tab:
              </strong>
              <ul className="mt-1.5 list-disc pl-5 text-[#595767] dark:text-slate-400">
                <li>
                  From the <strong className="text-[#2C365D] dark:text-slate-200">Account Details</strong>{" "}
                  page, go to the <strong className="text-[#2C365D] dark:text-slate-200">Financial</strong>{" "}
                  tab. This is where you can access billing information.
                </li>
              </ul>
            </li>
            <li>
              <strong className="text-[#2C365D] dark:text-slate-100">
                Review Invoice Highlights:
              </strong>
              <ul className="mt-1.5 list-disc pl-5 text-[#595767] dark:text-slate-400">
                <li>Look for any markers indicating exceptions, disputes, or high charges raised by the customer.</li>
              </ul>
            </li>
            <li>
              <strong className="text-[#2C365D] dark:text-slate-100">Expand the Invoice:</strong>
              <ul className="mt-1.5 list-disc pl-5 text-[#595767] dark:text-slate-400">
                <li>Click on the invoice to see a detailed line-by-line breakdown.</li>
              </ul>
            </li>
            <li>
              <strong className="text-[#2C365D] dark:text-slate-100">View Invoice (PDF):</strong>
              <ul className="mt-1.5 list-disc pl-5 text-[#595767] dark:text-slate-400">
                <li>
                  Use the <strong className="text-[#2C365D] dark:text-slate-200">View Invoice (PDF)</strong>{" "}
                  option to access a copy of the bill.
                </li>
              </ul>
            </li>
          </ol>

          <p className="mt-3 text-[#595767] dark:text-slate-400">
            If the customer has specific questions about the bill, such as high charges or billing
            history, ensure you&apos;ve clarified their needs and proceed accordingly. If you need
            further assistance, consider using the <strong className="text-[#2C365D] dark:text-slate-200">Companion</strong>{" "}
            tool for insights.
          </p>

          <Button type="button" variant="secondary" size="sm" className="mt-3 gap-1.5 !rounded-full">
            <Icon name="play_circle" size={16} />
            Walk me through it
          </Button>

          <div className="mt-3 border-t border-[#DEDEE1] pt-3 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#595767] dark:text-slate-400">
              <span>Sources:</span>
              {sources.map((source) => (
                <span
                  key={source}
                  className="rounded bg-[#F3F4F6] px-1.5 py-0.5 text-[11px] text-[#2C365D] dark:bg-white/10 dark:text-slate-300"
                >
                  {source}
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                aria-label="Helpful response"
                className="rounded border border-[#DEDEE1] px-2 py-1 hover:bg-[#F3F4F6] dark:border-gray-700 dark:hover:bg-white/10"
              >
                👍
              </button>
              <button
                type="button"
                aria-label="Not helpful response"
                className="rounded border border-[#DEDEE1] px-2 py-1 hover:bg-[#F3F4F6] dark:border-gray-700 dark:hover:bg-white/10"
              >
                👎
              </button>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}

function ActEmailDemoConversation({
  query,
  email,
}: {
  query: string;
  email: string;
}) {
  const initialReady = useDelayedReveal();
  const [step, setStep] = useState<ActEmailStep>("confirm");
  const [pendingStep, setPendingStep] = useState<ActEmailStep | null>(null);
  const [newEmail, setNewEmail] = useState(email);

  useEffect(() => {
    if (!pendingStep) return;
    const timer = window.setTimeout(() => {
      setStep(pendingStep);
      setPendingStep(null);
    }, CHAT_RESPONSE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pendingStep]);

  const advance = (next: ActEmailStep) => {
    if (pendingStep) return;
    setPendingStep(next);
  };

  const showThinking = !initialReady || pendingStep !== null;

  return (
    <div className="space-y-3">
      <div className="ml-auto w-fit max-w-[85%] rounded-lg bg-[#2C365D] px-4 py-3 text-sm text-white">
        {query}
      </div>

      {showThinking ? (
        <ThinkingIndicator />
      ) : (
        <article className="rounded-xl border border-[#DEDEE1] bg-white p-3 dark:border-gray-700 dark:bg-white/[0.06]">
          {step === "confirm" && (
            <div className={ACT_CARD}>
              <h3 className="text-base font-bold text-[#2C365D]">Confirm Contact</h3>
              <p className="mt-1 text-sm text-[#595767]">
                The Occupier · Account 4697741 · Customer 31650256
              </p>
              <p className="mt-4 font-bold text-[#2C365D]">Current values</p>
              <p className="mt-1 text-[#595767]">—</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => advance("update")}
                  className="rounded-lg px-3.5 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: ACT_ORANGE }}
                >
                  Confirm &amp; Continue
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[#DEDEE1] bg-white px-3.5 py-2 text-sm font-semibold text-[#2C365D]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === "update" && (
            <div className={ACT_CARD}>
              <h3 className="text-base font-bold text-[#2C365D]">Update contact email</h3>
              <p className="mt-1 text-sm text-[#595767]">Account 4697741</p>
              <p className="mt-4 font-bold text-[#2C365D]">Email:</p>
              <div className="mt-2 rounded-lg border border-[#DEDEE1] bg-white p-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-16 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                    Current
                  </span>
                  <span className="text-[#595767]">N/A</span>
                </div>
                <div className="my-2 pl-[4.75rem] text-[#9CA3AF]">↓</div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-16 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                    New
                  </span>
                  <input
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    className="h-8 flex-1 rounded border border-[#DEDEE1] px-2 text-sm text-[#181B25] outline-none focus:ring-2 focus:ring-[#2C365D]/30"
                    aria-label="New email"
                  />
                </div>
              </div>
              <button type="button" className="mt-3 text-sm font-medium text-[#0074C4] underline">
                Switch to Tally Assist
              </button>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => advance("done")}
                  className="rounded-lg px-3.5 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: ACT_ORANGE }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className={ACT_CARD}>
              <h3 className="flex items-center gap-2 text-base font-bold text-[#2C365D]">
                <Icon name="check_circle" size={18} className="text-[#008000]" />
                Contact email updated
              </h3>
              <p className="mt-1 text-sm text-[#595767]">Account 4697741</p>
              <p className="mt-3 text-sm text-[#595767]">
                The primary customer email is now{" "}
                <strong className="text-[#2C365D]">{newEmail}</strong>.
              </p>
            </div>
          )}
        </article>
      )}
    </div>
  );
}

function DocsList({
  docs,
  state,
  search,
  onSearchChange,
  onSelect,
}: {
  docs: CompanionDoc[];
  state: "loading" | "ready" | "error";
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (doc: CompanionDoc) => void;
}) {
  if (state === "loading") {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-500 dark:text-slate-400">
        Loading documentation…
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
        Documentation could not be loaded.
      </div>
    );
  }

  return (
    <>
      <div className="relative mb-4">
        <Icon
          name="search"
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search docs…"
          className="pl-9"
        />
      </div>
      {docs.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-slate-400">
          No documentation matches your search.
        </p>
      ) : (
        (Object.keys(CATEGORY_CONFIG) as CompanionDocCategory[]).map((category) => {
          const categoryDocs = docs.filter((doc) => doc.category === category);
          if (categoryDocs.length === 0) return null;
          const config = CATEGORY_CONFIG[category];
          return (
            <section key={category}>
              <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-gray-400 first:mt-0 dark:text-slate-500">
                {config.label}
              </h3>
              <div className="space-y-2">
                {categoryDocs.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => onSelect(doc)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border-l-[3px] bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-px hover:shadow-md dark:bg-white/[0.06]",
                      config.border
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{doc.title}</span>
                      <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-gray-500 dark:text-slate-400">
                        {doc.summary}
                      </span>
                    </span>
                    <Icon name="chevron_right" size={18} className="shrink-0 text-gray-400" />
                  </button>
                ))}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}

function DocDetail({ doc, onBack }: { doc: CompanionDoc; onBack: () => void }) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
      >
        <Icon name="chevron_left" size={17} />
        Back to docs
      </button>
      <article className="rounded-2xl bg-white p-5 shadow-sm dark:bg-white/[0.06]">
        <h2 className="text-base font-semibold">{doc.title}</h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Purpose
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
          {doc.purpose}
        </p>

        <DetailHeading>Before You Start</DetailHeading>
        <div className="space-y-2">
          {doc.beforeStart.map((requirement) => (
            <div key={requirement.title} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-[#00D2A2]" />
              <p className="text-gray-600 dark:text-slate-400">
                <strong className="text-gray-900 dark:text-slate-100">{requirement.title}</strong>
                {" — "}
                {requirement.description}
              </p>
            </div>
          ))}
        </div>

        <DetailHeading>Process Steps</DetailHeading>
        <Button type="button" size="sm" className="mb-4 gap-1.5 !bg-[#00D2A2] !text-[#2C365D]">
          <Icon name="play_arrow" size={16} />
          Walk me through it
        </Button>
        <div className="space-y-5">
          {doc.steps.map((step, index) => (
            <section key={step.title}>
              <h4 className="text-sm font-semibold">
                {index + 1}. {step.title}
              </h4>
              {step.location && (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-[#0074C4]/10 px-3 py-2 text-xs leading-relaxed text-[#005a9a] dark:text-sky-300">
                  <Icon name="location_on" size={16} className="shrink-0" />
                  <span>
                    <strong>Where in the system:</strong> {step.location}
                  </span>
                </div>
              )}
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                {step.body}
              </p>
              {step.referenceRows && (
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 dark:bg-white/[0.05] dark:text-slate-400">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Information</th>
                        <th className="px-3 py-2 font-semibold">Where to find</th>
                      </tr>
                    </thead>
                    <tbody>
                      {step.referenceRows.map((row) => (
                        <tr key={row.label} className="border-t border-gray-100 dark:border-white/[0.06]">
                          <td className="px-3 py-2 font-semibold">{row.label}</td>
                          <td className="px-3 py-2 text-gray-500 dark:text-slate-400">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

function DetailHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
      <span className="h-3 w-1 rounded-full bg-[#00D2A2]" />
      {children}
    </h3>
  );
}
