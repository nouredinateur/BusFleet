import React from "react";
import { Button } from "@/components/ui/button";
import { Bus, LogOut } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-platinum-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-persian-blue-500 to-dark-cyan-500 rounded-xl flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-buenard font-bold text-platinum-900">
                Bus Management Dashboard
              </h1>
              <p className="text-sm text-platinum-600 font-forum">
                Manage your fleet operations
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-platinum-700 hover:text-error-600 hover:border-error-300 font-inknut"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}