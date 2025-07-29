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
    <div className="flex space-x-1 mb-8 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-gray-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center space-x-2 px-4 py-3 rounded-lg font-medium font-inknut transition-all duration-200",
              activeTab === tab.id
                ? "bg-black-950 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/80 hover:text-orange-600"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
