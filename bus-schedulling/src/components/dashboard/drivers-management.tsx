import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Driver } from "./types";
import { EnhancedDataTable } from "@/components/ui/enhanced-data-table";
import { createDriversColumns } from "./columns/drivers-columns";
import { UserPermissions } from "@/lib/permissions";

interface DriversManagementProps {
  drivers: Driver[];
  onCreateDriver: () => void;
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (id: number) => void;
  permissions: UserPermissions;
}

export function DriversManagement({
  drivers,
  onCreateDriver,
  onEditDriver,
  onDeleteDriver,
  permissions,
}: DriversManagementProps) {
  const columns = createDriversColumns({ onEditDriver, onDeleteDriver, permissions });

  const columnFilters = [
    {
      columnId: "available",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "Available", value: "available" },
        { label: "Unavailable", value: "unavailable" },
      ],
      placeholder: "All statuses",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-buenard font-bold text-platinum-900">
          Driver Management
        </h2>
        {permissions.canCreate && (
          <Button
            onClick={onCreateDriver}
            className=" bg-black   hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Driver
          </Button>
        )}
      </div>

      <EnhancedDataTable
        columns={columns}
        data={drivers}
        searchKey="name"
        searchPlaceholder="Search drivers..."
        columnFilters={columnFilters}
      />
    </div>
  );
}