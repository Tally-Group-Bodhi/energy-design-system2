"use client";

import { useState } from "react";

interface TabNavigationProps {
  tabs: { id: string; label: string }[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function TabNavigation({
  tabs,
  defaultTab,
  onTabChange,
}: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <nav className="flex items-center border-b border-border bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex w-full max-w-full items-center px-6">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex items-center">
            <button
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-[#2C365D] text-[#2C365D] dark:text-[#7c8cb8]"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {tab.label}
            </button>
            {index < tabs.length - 1 && (
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-600" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

