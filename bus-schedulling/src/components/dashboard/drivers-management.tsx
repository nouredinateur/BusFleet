import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Driver } from "./types";
import { DataTable } from "@/components/ui/data-table";
import { createDriversColumns } from "./columns/drivers-columns";

interface DriversManagementProps {
  drivers: Driver[];
  onCreateDriver: () => void;
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (id: number) => void;
}

export function DriversManagement({
  drivers,
  onCreateDriver,
  onEditDriver,
  onDeleteDriver,
}: DriversManagementProps) {
  const columns = createDriversColumns({ onEditDriver, onDeleteDriver });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-buenard font-bold text-platinum-900">
          Driver Management
        </h2>
        <Button
          onClick={onCreateDriver}
          className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Driver
        </Button>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={drivers}
            searchKey="name"
            searchPlaceholder="Search drivers..."
          />
        </CardContent>
      </Card>
    </div>
  );
}