"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const isDark = theme === "dark";

  // Initialise from system / stored preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next: Theme = isDark ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
      window.localStorage.setItem("theme", next);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="mt-2 inline-flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-none hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2"
      aria-label="Toggle dark mode"
    >
      <span className="flex items-center gap-2">
        <Icon
          name={isDark ? "dark_mode" : "light_mode"}
          size={18}
          className="text-gray-600"
        />
        <span>{isDark ? "Dark mode on" : "Dark mode off"}</span>
      </span>
      <span className="flex h-5 w-9 items-center rounded-full bg-gray-200 px-0.5">
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            isDark ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

