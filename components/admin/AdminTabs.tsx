'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface AdminTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function AdminTabs({ tabs, defaultTab }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-zinc-800">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-6 py-3 font-medium transition-all relative whitespace-nowrap',
                'hover:text-zinc-100',
                activeTab === tab.id
                  ? 'text-zinc-50 border-b-2 border-accent-500'
                  : 'text-zinc-400 border-b-2 border-transparent'
              )}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-200">
        {activeTabContent}
      </div>
    </div>
  );
}
