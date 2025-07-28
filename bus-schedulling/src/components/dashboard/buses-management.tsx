import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Bus } from "./types";
import { DataTable } from "@/components/ui/data-table";
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

      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={buses}
            searchKey="plate_number"
            searchPlaceholder="Search buses..."
          />
        </CardContent>
      </Card>
    </div>
  );
}