import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Route } from "./types";

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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inknut">Origin</TableHead>
                <TableHead className="font-inknut">Destination</TableHead>
                <TableHead className="font-inknut">Duration</TableHead>
                <TableHead className="font-inknut">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-forum">{route.origin}</TableCell>
                  <TableCell className="font-forum">
                    {route.destination}
                  </TableCell>
                  <TableCell className="font-forum">
                    {route.estimated_duration_minutes} minutes
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditRoute(route)}
                        className="text-persian-blue-600 hover:text-persian-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteRoute(route.id)}
                        className="text-error-600 hover:text-error-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}