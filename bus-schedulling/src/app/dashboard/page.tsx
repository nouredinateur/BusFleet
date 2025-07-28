"use client";

import React, { useState } from "react";
import { useUser } from "@/contexts/user-context";
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
import { useDeleteMutation } from "@/components/dashboard/hooks/use-dashboard-mutations";
import {
  DialogState,
  FormData,
  TabType,
  ValidationErrors,
  FilterState,
  Driver,
  Bus,
  Route,
  Shift,
} from "@/components/dashboard/types";

export default function Dashboard() {
  const { user, permissions, loading } = useUser();
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
  
  // React Query mutations
  const deleteMutation = useDeleteMutation();
  
  // State for success/error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-persian-blue-50 via-dark-cyan-50 to-platinum-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-persian-blue-50 via-dark-cyan-50 to-platinum-100 flex items-center justify-center">
        <div className="text-lg">Please log in to access the dashboard.</div>
      </div>
    );
  }

  // Fix for onFilterChange - create a wrapper function that merges partial updates
  const handleFilterChange = (filters: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...filters }));
  };

  const handleEdit = (type: string, item: Driver | Bus | Route | Shift) => {
    formState.setEditingItem(item);
    
    // Convert the item to FormData format
    let formData: FormData = {};
    
    if (type === "drivers" || type === "driver") {
      const driver = item as Driver;
      formData = {
        name: driver.name,
        license_number: driver.license_number,
        available: driver.available,
      };
    } else if (type === "buses" || type === "bus") {
      const bus = item as Bus;
      formData = {
        plate_number: bus.plate_number,
        capacity: bus.capacity,
      };
    } else if (type === "routes" || type === "route") {
      const route = item as Route;
      formData = {
        origin: route.origin,
        destination: route.destination,
        estimated_duration_minutes: route.estimated_duration_minutes,
      };
    } else if (type === "shifts" || type === "shift") {
      const shift = item as Shift;
      formData = {
        driver_id: shift.driver_id,
        bus_id: shift.bus_id,
        route_id: shift.route_id,
        shift_date: shift.shift_date,
        shift_time: shift.shift_time,
      };
    }
    
    formState.setFormData(formData);
    formState.setValidationErrors({});
    formState.setDialogError("");

    if (type === "drivers" || type === "driver") dialogState.setDriverDialogOpen(true);
    else if (type === "buses" || type === "bus") dialogState.setBusDialogOpen(true);
    else if (type === "routes" || type === "route") dialogState.setRouteDialogOpen(true);
    else if (type === "shifts" || type === "shift") dialogState.setShiftDialogOpen(true);
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteMutation.mutateAsync({ type, id });
      setSuccessMessage("Item deleted successfully");
      setErrorMessage("");
    } catch (err: any) {
      setErrorMessage(err.message || "Delete failed");
      setSuccessMessage("");
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
          error={dashboardData.error || errorMessage}
          success={successMessage}
        />

        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "schedule" && (
          <ScheduleViewer
            shifts={dashboardData.shifts}
            drivers={dashboardData.drivers}
            buses={dashboardData.buses}
            routes={dashboardData.routes}
            onCreateShift={permissions.canCreate ? () => openCreateDialog("shift") : () => {}}
            onEditShift={permissions.canEdit ? (shift) => handleEdit("shift", shift) : () => {}}
            onDeleteShift={permissions.canDelete ? (id) => handleDelete("shifts", id) : () => {}}
            filterState={filterState}
            onFilterChange={handleFilterChange}
          />
        )}

        {activeTab === "drivers" && (
          <DriversManagement
            drivers={dashboardData.drivers}
            onCreateDriver={permissions.canCreate ? () => openCreateDialog("driver") : () => {}}
            onEditDriver={permissions.canEdit ? (driver) => handleEdit("driver", driver) : () => {}}
            onDeleteDriver={permissions.canDelete ? (id) => handleDelete("drivers", id) : () => {}}
          />
        )}

        {activeTab === "buses" && (
          <BusesManagement
            buses={dashboardData.buses}
            onCreateBus={permissions.canCreate ? () => openCreateDialog("bus") : () => {}}
            onEditBus={permissions.canEdit ? (bus) => handleEdit("bus", bus) : () => {}}
            onDeleteBus={permissions.canDelete ? (id) => handleDelete("buses", id) : () => {}}
          />
        )}

        {activeTab === "routes" && (
          <RoutesManagement
            routes={dashboardData.routes}
            onCreateRoute={permissions.canCreate ? () => openCreateDialog("route") : () => {}}
            onEditRoute={permissions.canEdit ? (route) => handleEdit("route", route) : () => {}}
            onDeleteRoute={permissions.canDelete ? (id) => handleDelete("routes", id) : () => {}}
          />
        )}
      </div>

      {/* Dialogs - only show if user has permissions */}
      {(permissions.canCreate || permissions.canEdit) && (
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
      )}

      {(permissions.canCreate || permissions.canEdit) && (
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
      )}

      {(permissions.canCreate || permissions.canEdit) && (
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
      )}

      {(permissions.canCreate || permissions.canEdit) && (
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
      )}
    </div>
  );
}
