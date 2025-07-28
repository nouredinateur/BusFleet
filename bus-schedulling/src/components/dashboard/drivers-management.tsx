import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Driver } from "./types";

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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inknut">Name</TableHead>
                <TableHead className="font-inknut">License Number</TableHead>
                <TableHead className="font-inknut">Status</TableHead>
                <TableHead className="font-inknut">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-forum">{driver.name}</TableCell>
                  <TableCell className="font-forum">
                    {driver.license_number}
                  </TableCell>
                  <TableCell>
                    <Badge variant={driver.available ? "success" : "secondary"}>
                      {driver.available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditDriver(driver)}
                        className="text-persian-blue-600 hover:text-persian-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteDriver(driver.id)}
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