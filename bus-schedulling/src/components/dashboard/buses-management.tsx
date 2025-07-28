import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Bus } from "./types";
import { EnhancedDataTable } from "@/components/ui/enhanced-data-table";
import { createBusesColumns } from "./columns/buses-columns";

interface BusesManagementProps {
  buses: Bus[];
  onCreateBus: () => void;
  onEditBus: (bus: Bus) => void;
  onDeleteBus: (id: number) => void;
}

export function BusesManagement({
  buses,
  onCreateBus,
  onEditBus,
  onDeleteBus,
}: BusesManagementProps) {
  const columns = createBusesColumns({ onEditBus, onDeleteBus });

  // Create capacity range options
  const capacityOptions = React.useMemo(() => {
    const capacities = [...new Set(buses.map(bus => bus.capacity))].sort((a, b) => a - b);
    return capacities.map(capacity => ({
      label: `${capacity} passengers`,
      value: capacity.toString(),
    }));
  }, [buses]);

  const columnFilters = [
    {
      columnId: "capacity",
      label: "Capacity",
      type: "select" as const,
      options: capacityOptions,
      placeholder: "All capacities",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-buenard font-bold text-platinum-900">
          Bus Management
        </h2>
        <Button
          onClick={onCreateBus}
          className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bus
        </Button>
      </div>

      <EnhancedDataTable
        columns={columns}
        data={buses}
        searchKey="plate_number"
        searchPlaceholder="Search buses..."
        columnFilters={columnFilters}
      />
    </div>
  );
}