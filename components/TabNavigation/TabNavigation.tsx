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
    <nav className="flex items-center border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-full items-center px-6">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex items-center">
            <button
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-[#2C365D] text-[#2C365D]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
            {index < tabs.length - 1 && (
              <div className="h-4 w-px bg-gray-200" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

