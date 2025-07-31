"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/avatar-wrapper";
import { ArrowUpDown } from "lucide-react";
import { Shift } from "../types";
import { UserPermissions } from "@/lib/permissions";
import { GenericActionButtons } from "./generic-action-buttons";

interface ShiftsColumnsProps {
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (id: number) => void;
  permissions: UserPermissions;
}

export function createShiftsColumns({
  onEditShift,
  onDeleteShift,
  permissions,
}: ShiftsColumnsProps): ColumnDef<Shift>[] {
  const columns: ColumnDef<Shift>[] = [
    {
      accessorKey: "shift_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("shift_date") as string;
        const time = row.getValue("shift_time") as string;
        const shift = `${date} → ${time}`;
        return (
          <div className="flex items-center space-x-3">
            <Avatar
              name={shift}
              size={40}
              variant="ring"
              colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]}
            />
            <div className="font-mono">{row.getValue("shift_date")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "shift_time",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-inknut hover:bg-transparent"
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-forum">{row.getValue("shift_time")}</div>
      ),
    },
    {
      accessorKey: "driver.name",
      header: "Driver",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="font-forum">{shift.driver?.name || "Unknown"}</div>
        );
      },
    },
    {
      accessorKey: "bus.plate_number",
      header: "Bus",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="font-forum">
            {shift.bus?.plate_number || "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "route",
      header: "Route",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="font-forum">
            {shift.route
              ? `${shift.route.origin} → ${shift.route.destination}`
              : "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "route.estimated_duration_minutes",
      header: "Duration",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <div className="font-forum">
            {shift.route?.estimated_duration_minutes || 0} min
          </div>
        );
      },
    },
  ];

  // Only add actions column if user has edit or delete permissions
  if (permissions.canEdit || permissions.canDelete) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <GenericActionButtons
            item={shift}
            onEdit={onEditShift}
            onDelete={onDeleteShift}
            permissions={permissions}
            deleteConfirmation={{
              title: "Delete Shift",
              getDescription: (shift) => {
                const shiftInfo = `${shift.shift_date} at ${shift.shift_time}`;
                return `Are you sure you want to delete the shift on ${shiftInfo}? This action cannot be undone.`;
              },
            }}
          />
        );
      },
    });
  }

  return columns;
}
