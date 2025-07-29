"use client";

import { useState } from "react";
import { FormData, ValidationErrors, FormState } from "../types";
import { 
  validateDriverForm, 
  validateBusForm, 
  validateRouteForm, 
  validateShiftForm 
} from "../utils/validation";
import { useCreateMutation, useUpdateMutation } from "./use-dashboard-mutations";

export function useFormState() {
  const [formState, setFormState] = useState<FormState>({
    editingItem: null,
    formData: {},
    validationErrors: {},
    dialogError: "",
  });

  const createMutation = useCreateMutation();
  const updateMutation = useUpdateMutation();

  const setEditingItem = (item: any) => {
    setFormState(prev => ({ ...prev, editingItem: item }));
  };

  const setFormData = (data: FormData) => {
    setFormState(prev => ({ ...prev, formData: data }));
  };

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

    try {
      if (formState.editingItem) {
        // Update existing item
        const updateData = { id: formState.editingItem.id, ...formState.formData };
        await updateMutation.mutateAsync({ type, data: updateData });
        dashboardData.setSuccess(`${type.slice(0, -1)} updated successfully`);
      } else {
        // Create new item
        await createMutation.mutateAsync({ type, data: formState.formData });
        dashboardData.setSuccess(`${type.slice(0, -1)} created successfully`);
      }

      // Close the appropriate dialog
      if (type === "drivers") dialogState.setDriverDialogOpen(false);
      else if (type === "buses") dialogState.setBusDialogOpen(false);
      else if (type === "routes") dialogState.setRouteDialogOpen(false);
      else if (type === "shifts") dialogState.setShiftDialogOpen(false);

      // Reset form state
      setFormData({});
      setEditingItem(null);
      setValidationErrors({});
      setDialogError("");
      dashboardData.setError("");
    } catch (err: any) {
      setDialogError(err.message || "Operation failed");
      dashboardData.setError(err.message || "Operation failed");
    }
  };

  return {
    ...formState,
    setEditingItem,
    setFormData,
    updateFormData,
    setValidationErrors,
    setDialogError,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}