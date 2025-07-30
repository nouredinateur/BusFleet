"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useUser } from "@/contexts/user-context";

export function DashboardHeader() {
  const router = useRouter();
  const { user, setUser } = useUser();
  
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Clear user from context
        setUser(null);

        // Redirect to login page
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-platinum-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Title Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <img
                src="/markoub.png"
                alt="Markoub Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-buenard font-bold text-platinum-900 truncate">
                BusFleet
              </h1>
              <p className="text-xs sm:text-sm text-platinum-600 font-forum truncate hidden sm:block">
                Manage your fleet operations
              </p>
            </div>
          </div>

          {/* User Info and Logout Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* User Welcome - Hidden on very small screens */}
            {user && (
              <div className="text-xs sm:text-sm text-platinum-600 hidden md:block">
                Welcome,{" "}
                <span className="text-black font-medium">{user.name}</span>
              </div>
            )}
            
            {/* User Initial on small screens */}
            {user && (
              <div className="md:hidden w-8 h-8 bg-platinum-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-platinum-700">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="cursor-pointer text-platinum-700 hover:text-accent font-bold hover:bg-black font-inknut h-8 sm:h-9 px-2 sm:px-3"
              size="sm"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
