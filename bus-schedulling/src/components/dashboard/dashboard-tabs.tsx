import React from "react";
import { Bus, Users, Route, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { TabType, Tab } from "./types";

interface DashboardTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: Tab[] = [
  { id: "schedule", label: "Schedule Viewer", icon: Calendar },
  { id: "drivers", label: "Drivers", icon: Users },
  { id: "buses", label: "Buses", icon: Bus },
  { id: "routes", label: "Routes", icon: Route },
];

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile: Horizontal scrollable tabs */}
      <div className="sm:hidden">
        <div className="flex overflow-x-auto scrollbar-hide bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-gray-200 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-lg font-medium font-inknut transition-all duration-150 ease-in-out transform whitespace-nowrap flex-shrink-0 min-w-fit",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  activeTab === tab.id
                    ? "bg-black-950 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/80 hover:text-orange-600"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Regular flex layout */}
      <div className="hidden sm:flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 rounded-lg font-medium font-inknut transition-all duration-150 ease-in-out transform flex-1 justify-center",
                "hover:scale-[1.02] active:scale-[0.98]",
                activeTab === tab.id
                  ? "bg-black-950 text-white shadow-lg"
                  : "text-gray-700 hover:bg-white/80 hover:text-orange-600"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
