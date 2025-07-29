import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Route } from "./types";
import { EnhancedDataTable } from "@/components/ui/enhanced-data-table";
import { createRoutesColumns } from "./columns/routes-columns";
import { UserPermissions } from "@/lib/permissions";

interface RoutesManagementProps {
  routes: Route[];
  onCreateRoute: () => void;
  onEditRoute: (route: Route) => void;
  onDeleteRoute: (id: number) => void;
  permissions: UserPermissions;
}

export function RoutesManagement({
  routes,
  onCreateRoute,
  onEditRoute,
  onDeleteRoute,
  permissions,
}: RoutesManagementProps) {
  const columns = createRoutesColumns({
    onEditRoute,
    onDeleteRoute,
    permissions,
  });

  // Create dynamic filter options based on actual data
  const originOptions = React.useMemo(() => {
    const origins = [...new Set(routes.map((route) => route.origin))].sort();
    return origins.map((origin) => ({
      label: origin,
      value: origin,
    }));
  }, [routes]);

  const destinationOptions = React.useMemo(() => {
    const destinations = [
      ...new Set(routes.map((route) => route.destination)),
    ].sort();
    return destinations.map((destination) => ({
      label: destination,
      value: destination,
    }));
  }, [routes]);

  // Create duration range options
  const durationOptions = React.useMemo(() => {
    const durations = [
      ...new Set(routes.map((route) => route.estimated_duration_minutes)),
    ].sort((a, b) => a - b);
    return [
      { label: "Under 30 min", value: "under-30" },
      { label: "30-60 min", value: "30-60" },
      { label: "60-120 min", value: "60-120" },
      { label: "Over 120 min", value: "over-120" },
    ];
  }, [routes]);

  const columnFilters = [
    {
      columnId: "origin",
      label: "Origin",
      type: "select" as const,
      options: originOptions,
      placeholder: "All origins",
    },
    {
      columnId: "destination",
      label: "Destination",
      type: "select" as const,
      options: destinationOptions,
      placeholder: "All destinations",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-buenard font-bold text-platinum-900">
          Route Management
        </h2>
        {permissions.canCreate && (
          <Button
            onClick={onCreateRoute}
            className=" bg-black  hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Route
          </Button>
        )}
      </div>

      <EnhancedDataTable
        columns={columns}
        data={routes}
        searchKey="origin"
        searchPlaceholder="Search routes..."
        columnFilters={columnFilters}
      />
    </div>
  );
}
