"use client";

import React, { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { AlertMessages } from "@/components/dashboard/alert-messages";
import { ScheduleViewer } from "@/components/dashboard/schedule-viewer";
import { DriversManagement } from "@/components/dashboard/drivers-management";
import { BusesManagement } from "@/components/dashboard/buses-management";
import { RoutesManagement } from "@/components/dashboard/routes-management";
import { DriverDialog } from "@/components/dashboard/dialogs/driver-dialog";
import { BusDialog } from "@/components/dashboard/dialogs/bus-dialog";
import { RouteDialog } from "@/components/dashboard/dialogs/route-dialog";
import { ShiftDialog } from "@/components/dashboard/dialogs/shift-dialog";
import { useDashboardData } from "@/components/dashboard/hooks/use-dashboard-data";
import { useDialogState } from "@/components/dashboard/hooks/use-dialog-state";
import { useFormState } from "@/components/dashboard/hooks/use-form-state";
import {
  DialogState,
  FormData,
  TabType,
  ValidationErrors,
  FilterState,
} from "@/components/dashboard/types";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("schedule");
  const [filterState, setFilterState] = useState<FilterState>({
    filterDate: "",
    filterDriver: "",
    filterBus: "",
  });
  // Custom hooks for state management
  const dashboardData = useDashboardData();
  const dialogState = useDialogState();
  const formState = useFormState();

  // Fix for onFilterChange - create a wrapper function that merges partial updates
  const handleFilterChange = (filters: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...filters }));
  };

  const handleEdit = (type: string, item: any) => {
    formState.setEditingItem(item);
    formState.setFormData(item);
    formState.setValidationErrors({});
    formState.setDialogError("");

    if (type === "drivers") dialogState.setDriverDialogOpen(true);
    else if (type === "buses") dialogState.setBusDialogOpen(true);
    else if (type === "routes") dialogState.setRouteDialogOpen(true);
    else if (type === "shifts") dialogState.setShiftDialogOpen(true);
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/${type}?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete failed");
      }

      if (type === "driver") {
        dashboardData.setDrivers(
          dashboardData.drivers.filter((d) => d.id !== id)
        );
      } else if (type === "bus") {
        dashboardData.setBuses(dashboardData.buses.filter((b) => b.id !== id));
      } else if (type === "route") {
        dashboardData.setRoutes(
          dashboardData.routes.filter((r) => r.id !== id)
        );
      } else if (type === "shift") {
        dashboardData.setShifts(
          dashboardData.shifts.filter((s) => s.id !== id)
        );
      }
      dashboardData.setSuccess("Item deleted successfully");
    } catch (err: any) {
      dashboardData.setError(err.message || "Delete failed");
    }
  };

  const openCreateDialog = (type: string) => {
    formState.setEditingItem(null);
    formState.setFormData({});
    formState.setValidationErrors({});
    formState.setDialogError("");

    if (type === "driver") dialogState.setDriverDialogOpen(true);
    else if (type === "bus") dialogState.setBusDialogOpen(true);
    else if (type === "route") dialogState.setRouteDialogOpen(true);
    else if (type === "shift") dialogState.setShiftDialogOpen(true);
  };

  // Create wrapper functions for onSubmit to match expected signatures
  const handleDriverSubmit = () =>
    formState.handleSubmit("drivers", dashboardData, dialogState);
  const handleBusSubmit = () =>
    formState.handleSubmit("buses", dashboardData, dialogState);
  const handleRouteSubmit = () =>
    formState.handleSubmit("routes", dashboardData, dialogState);
  const handleShiftSubmit = () =>
    formState.handleSubmit("shifts", dashboardData, dialogState);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-persian-blue-50 via-dark-cyan-50 to-platinum-100"
      data-testid="bus-management-dashboard"
    >
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AlertMessages
          error={dashboardData.error}
          success={dashboardData.success}
        />

        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "schedule" && (
          <ScheduleViewer
            shifts={dashboardData.shifts}
            drivers={dashboardData.drivers}
            buses={dashboardData.buses}
            routes={dashboardData.routes}
            onCreateShift={() => openCreateDialog("shift")}
            onEditShift={(shift) => handleEdit("shift", shift)}
            onDeleteShift={(id) => handleDelete("shifts", id)}
            filterState={filterState}
            onFilterChange={handleFilterChange}
          />
        )}

        {activeTab === "drivers" && (
          <DriversManagement
            drivers={dashboardData.drivers}
            onCreateDriver={() => openCreateDialog("driver")}
            onEditDriver={(driver) => handleEdit("driver", driver)}
            onDeleteDriver={(id) => handleDelete("drivers", id)}
          />
        )}

        {activeTab === "buses" && (
          <BusesManagement
            buses={dashboardData.buses}
            onCreateBus={() => openCreateDialog("bus")}
            onEditBus={(bus) => handleEdit("bus", bus)}
            onDeleteBus={(id) => handleDelete("buses", id)}
          />
        )}

        {activeTab === "routes" && (
          <RoutesManagement
            routes={dashboardData.routes}
            onCreateRoute={() => openCreateDialog("route")}
            onEditRoute={(route) => handleEdit("route", route)}
            onDeleteRoute={(id) => handleDelete("routes", id)}
          />
        )}
      </div>

      {/* Dialogs */}
      <DriverDialog
        open={dialogState.driverDialogOpen}
        onOpenChange={dialogState.setDriverDialogOpen}
        editingItem={formState.editingItem}
        formData={formState.formData}
        onFormDataChange={formState.updateFormData}
        validationErrors={formState.validationErrors}
        dialogError={formState.dialogError}
        loading={dashboardData.loading}
        onSubmit={handleDriverSubmit}
      />

      <BusDialog
        open={dialogState.busDialogOpen}
        onOpenChange={dialogState.setBusDialogOpen}
        editingItem={formState.editingItem}
        formData={formState.formData}
        onFormDataChange={formState.updateFormData}
        validationErrors={formState.validationErrors}
        dialogError={formState.dialogError}
        loading={dashboardData.loading}
        onSubmit={handleBusSubmit}
      />

      <RouteDialog
        open={dialogState.routeDialogOpen}
        onOpenChange={dialogState.setRouteDialogOpen}
        editingItem={formState.editingItem}
        formData={formState.formData}
        onFormDataChange={formState.updateFormData}
        validationErrors={formState.validationErrors}
        dialogError={formState.dialogError}
        loading={dashboardData.loading}
        onSubmit={handleRouteSubmit}
      />

      <ShiftDialog
        open={dialogState.shiftDialogOpen}
        onOpenChange={dialogState.setShiftDialogOpen}
        editingItem={formState.editingItem}
        formData={formState.formData}
        onFormDataChange={formState.updateFormData}
        validationErrors={formState.validationErrors}
        dialogError={formState.dialogError}
        loading={dashboardData.loading}
        onSubmit={handleShiftSubmit}
        drivers={dashboardData.drivers}
        buses={dashboardData.buses}
        routes={dashboardData.routes}
      />
    </div>
  );
}
