"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "theme-mode";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolved = mode === "system" ? getSystemTheme() : mode;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export default function ThemeModeSwitch() {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Hydrate from storage and apply
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial: ThemeMode = stored === "system" || stored === "light" || stored === "dark" ? stored : "system";
    setMode(initial);
    applyTheme(initial);
    setResolvedTheme(initial === "system" ? getSystemTheme() : initial);
  }, []);

  // React to system preference when mode is "system"
  useEffect(() => {
    if (mode !== "system") return;
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = media.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyTheme("system");
    };
    media?.addEventListener("change", handler);
    return () => media?.removeEventListener("change", handler);
  }, [mode]);

  const selectMode = (next: ThemeMode) => {
    setMode(next);
    const resolved = next === "system" ? getSystemTheme() : next;
    setResolvedTheme(resolved);
    applyTheme(next);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, next);
  };

  const options: { value: ThemeMode; icon: string; label: string }[] = [
    { value: "system", icon: "monitor", label: "System" },
    { value: "light", icon: "light_mode", label: "Light" },
    { value: "dark", icon: "dark_mode", label: "Dark" },
  ];

  return (
    <div
      className="inline-flex items-center rounded-full border border-gray-200/80 bg-gray-50/90 p-px dark:border-gray-600/60 dark:bg-gray-800/50"
      role="group"
      aria-label="Theme mode"
    >
      {options.map(({ value, icon, label }) => {
        const isSelected = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => selectMode(value)}
            aria-pressed={isSelected}
            aria-label={label}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2C365D] focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
              isSelected
                ? "bg-gray-200/80 text-gray-700 dark:bg-gray-600/60 dark:text-gray-200"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700/50 dark:hover:text-gray-300"
            )}
          >
            <Icon name={icon} size={14} className={cn(isSelected && "opacity-100")} />
          </button>
        );
      })}
    </div>
  );
}
