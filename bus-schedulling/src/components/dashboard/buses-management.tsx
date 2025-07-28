import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Bus } from "./types";

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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inknut">Plate Number</TableHead>
                <TableHead className="font-inknut">Capacity</TableHead>
                <TableHead className="font-inknut">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell className="font-forum">
                    {bus.plate_number}
                  </TableCell>
                  <TableCell className="font-forum">
                    {bus.capacity} passengers
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditBus(bus)}
                        className="text-persian-blue-600 hover:text-persian-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteBus(bus.id)}
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