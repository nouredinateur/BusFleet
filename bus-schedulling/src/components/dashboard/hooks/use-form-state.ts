"use client";

import { useState } from "react";
import { FormData, ValidationErrors, FormState } from "../types";
import { 
  validateDriverForm, 
  validateBusForm, 
  validateRouteForm, 
  validateShiftForm 
} from "../utils/validation";

export function useFormState() {
  const [formState, setFormState] = useState<FormState>({
    editingItem: null,
    formData: {},
    validationErrors: {},
    dialogError: "",
  });

  const setEditingItem = (item: any) => {
    setFormState(prev => ({ ...prev, editingItem: item }));
  };

  const setFormData = (data: FormData) => {
    setFormState(prev => ({ ...prev, formData: data }));
  };

  // Add a function that accepts partial form data updates
  const updateFormData = (data: Partial<FormData>) => {
    setFormState(prev => ({ 
      ...prev, 
      formData: { ...prev.formData, ...data } 
    }));
  };

  const setValidationErrors = (errors: ValidationErrors) => {
    setFormState(prev => ({ ...prev, validationErrors: errors }));
  };

  const setDialogError = (error: string) => {
    setFormState(prev => ({ ...prev, dialogError: error }));
  };

  const handleSubmit = async (type: string, dashboardData: any, dialogState: any) => {
    setDialogError("");
    setValidationErrors({});
    
    // Validate form based on type
    let errors: ValidationErrors = {};
    switch (type) {
      case "drivers":
        errors = validateDriverForm(formState.formData);
        break;
      case "buses":
        errors = validateBusForm(formState.formData);
        break;
      case "routes":
        errors = validateRouteForm(formState.formData);
        break;
      case "shifts":
        errors = validateShiftForm(formState.formData);
        break;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setDialogError("Please fix the errors below before submitting");
      return;
    }

    dashboardData.setLoading(true);
    dashboardData.setError("");
    dashboardData.setSuccess("");

    try {
      const method = formState.editingItem ? "PUT" : "POST";
      const body = formState.editingItem 
        ? { id: formState.editingItem.id, ...formState.formData } 
        : formState.formData;

      const response = await fetch(`/api/${type}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Operation failed");
      }

      const result = await response.json();

      // Update the appropriate data based on type
      if (type === "drivers") {
        if (formState.editingItem) {
          dashboardData.setDrivers(
            dashboardData.drivers.map((d: any) => 
              d.id === formState.editingItem.id ? result : d
            )
          );
          dashboardData.setSuccess("Driver updated successfully");
        } else {
          dashboardData.setDrivers([...dashboardData.drivers, result]);
          dashboardData.setSuccess("Driver created successfully");
        }
        dialogState.setDriverDialogOpen(false);
      } else if (type === "buses") {
        if (formState.editingItem) {
          dashboardData.setBuses(
            dashboardData.buses.map((b: any) => 
              b.id === formState.editingItem.id ? result : b
            )
          );
          dashboardData.setSuccess("Bus updated successfully");
        } else {
          dashboardData.setBuses([...dashboardData.buses, result]);
          dashboardData.setSuccess("Bus created successfully");
        }
        dialogState.setBusDialogOpen(false);
      } else if (type === "routes") {
        if (formState.editingItem) {
          dashboardData.setRoutes(
            dashboardData.routes.map((r: any) => 
              r.id === formState.editingItem.id ? result : r
            )
          );
          dashboardData.setSuccess("Route updated successfully");
        } else {
          dashboardData.setRoutes([...dashboardData.routes, result]);
          dashboardData.setSuccess("Route created successfully");
        }
        dialogState.setRouteDialogOpen(false);
      } else if (type === "shifts") {
        if (formState.editingItem) {
          dashboardData.setShifts(
            dashboardData.shifts.map((s: any) => 
              s.id === formState.editingItem.id ? result : s
            )
          );
          dashboardData.setSuccess("Shift updated successfully");
        } else {
          dashboardData.setShifts([...dashboardData.shifts, result]);
          dashboardData.setSuccess("Shift created successfully");
        }
        dialogState.setShiftDialogOpen(false);
        
        // Reload shifts to get the populated data
        const shiftsRes = await fetch("/api/shifts");
        if (shiftsRes.ok) {
          const shifts = await shiftsRes.json();
          dashboardData.setShifts(shifts);
        }
      }

      // Reset form state
      setFormData({});
      setEditingItem(null);
      setValidationErrors({});
      setDialogError("");
    } catch (err: any) {
      setDialogError(err.message || "Operation failed");
    } finally {
      dashboardData.setLoading(false);
    }
  };

  return {
    ...formState,
    setEditingItem,
    setFormData,
    updateFormData, // Export the new function for partial updates
    setValidationErrors,
    setDialogError,
    handleSubmit,
  };
}