import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Driver, Bus, Route, Shift, FilterState } from "./types";
import { EnhancedDataTable } from "@/components/ui/enhanced-data-table";
import { createShiftsColumns } from "./columns/shifts-columns";
import { UserPermissions } from "@/lib/permissions";

interface ScheduleViewerProps {
  shifts: Shift[];
  drivers: Driver[];
  buses: Bus[];
  routes: Route[];
  filterState: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onCreateShift: () => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (id: number) => void;
  permissions: UserPermissions;
}

export function ScheduleViewer({
  shifts,
  drivers,
  buses,
  routes,
  filterState,
  onFilterChange,
  onCreateShift,
  onEditShift,
  onDeleteShift,
  permissions,
}: ScheduleViewerProps) {
  const columns = createShiftsColumns({
    onEditShift,
    onDeleteShift,
    permissions,
  });

  // Convert filter options for enhanced data table
  const columnFilters = [
    {
      columnId: "shift_date",
      label: "Date",
      type: "select" as const,
      placeholder: "All dates",
      options: [...new Set(shifts.map((shift) => shift.shift_date))].map(
        (date) => ({
          value: date,
          label: new Date(date).toLocaleDateString(),
        })
      ),
    },
    {
      columnId: "driver_name",
      label: "Driver",
      type: "select" as const,
      placeholder: "All drivers",
      options: drivers.map((driver) => ({
        value: driver.name,
        label: driver.name,
      })),
    },
    {
      columnId: "bus_plate_number",
      label: "Bus",
      type: "select" as const,
      placeholder: "All buses",
      options: buses.map((bus) => ({
        value: bus.plate_number,
        label: bus.plate_number,
      })),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-buenard font-bold text-platinum-900">
          Schedule Viewer
        </h2>
        {permissions.canCreate && (
          <Button
            onClick={onCreateShift}
            className="bg-black hover:bg-gray-800 text-white font-inknut w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Shift
          </Button>
        )}
      </div>

      <EnhancedDataTable
        columns={columns}
        data={shifts}
        title="Shifts Schedule"
        searchKey="shift_date"
        searchPlaceholder="Search by date..."
        columnFilters={columnFilters}
      />
    </div>
  );
}
