import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";
import { Driver, Bus, Route, Shift, FilterState } from "./types";
import { DataTable } from "@/components/ui/data-table";
import { createShiftsColumns } from "./columns/shifts-columns";

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
}: ScheduleViewerProps) {
  const getFilteredShifts = () => {
    return shifts.filter((shift) => {
      if (filterState.filterDate && shift.shift_date !== filterState.filterDate) return false;
      if (filterState.filterDriver && shift.driver_id.toString() !== filterState.filterDriver) return false;
      if (filterState.filterBus && shift.bus_id.toString() !== filterState.filterBus) return false;
      return true;
    });
  };

  const columns = createShiftsColumns({ onEditShift, onDeleteShift });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-buenard font-bold text-platinum-900">
          Schedule Viewer
        </h2>
        <Button
          onClick={onCreateShift}
          className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Shift
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-buenard">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Date
              </Label>
              <Input
                type="date"
                value={filterState.filterDate}
                onChange={(e) => onFilterChange({ filterDate: e.target.value })}
                className="font-forum"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Driver
              </Label>
              <Select
                value={filterState.filterDriver}
                onValueChange={(value) => onFilterChange({ filterDriver: value })}
              >
                <SelectTrigger className="font-forum">
                  <SelectValue placeholder="All drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All drivers</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id.toString()}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Bus
              </Label>
              <Select
                value={filterState.filterBus}
                onValueChange={(value) => onFilterChange({ filterBus: value })}
              >
                <SelectTrigger className="font-forum">
                  <SelectValue placeholder="All buses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All buses</SelectItem>
                  {buses.map((bus) => (
                    <SelectItem key={bus.id} value={bus.id.toString()}>
                      {bus.plate_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shifts Table */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={getFilteredShifts()}
            searchKey="shift_date"
            searchPlaceholder="Search by date..."
          />
        </CardContent>
      </Card>
    </div>
  );
}