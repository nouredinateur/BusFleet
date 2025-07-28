import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Route } from "./types";
import { DataTable } from "@/components/ui/data-table";
import { createRoutesColumns } from "./columns/routes-columns";

interface RoutesManagementProps {
  routes: Route[];
  onCreateRoute: () => void;
  onEditRoute: (route: Route) => void;
  onDeleteRoute: (id: number) => void;
}

export function RoutesManagement({
  routes,
  onCreateRoute,
  onEditRoute,
  onDeleteRoute,
}: RoutesManagementProps) {
  const columns = createRoutesColumns({ onEditRoute, onDeleteRoute });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-buenard font-bold text-platinum-900">
          Route Management
        </h2>
        <Button
          onClick={onCreateRoute}
          className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Route
        </Button>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={routes}
            searchKey="origin"
            searchPlaceholder="Search routes..."
          />
        </CardContent>
      </Card>
    </div>
  );
}