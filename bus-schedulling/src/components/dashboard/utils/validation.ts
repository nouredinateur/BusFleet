import { FormData, ValidationErrors } from "../types";

export const validateDriverForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!formData.name?.trim()) {
    errors.name = "Driver name is required";
  }
  
  if (!formData.license_number?.trim()) {
    errors.license_number = "License number is required";
  } else if (formData.license_number.length < 5) {
    errors.license_number = "License number must be at least 5 characters";
  }
  
  return errors;
};

export const validateBusForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!formData.plate_number?.trim()) {
    errors.plate_number = "Plate number is required";
  }
  
  if (!formData.capacity || formData.capacity <= 0) {
    errors.capacity = "Capacity must be greater than 0";
  } else if (formData.capacity > 100) {
    errors.capacity = "Capacity cannot exceed 100 passengers";
  }
  
  return errors;
};

export const validateRouteForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!formData.origin?.trim()) {
    errors.origin = "Origin is required";
  }
  
  if (!formData.destination?.trim()) {
    errors.destination = "Destination is required";
  }
  
  if (formData.origin?.trim() === formData.destination?.trim()) {
    errors.destination = "Destination must be different from origin";
  }
  
  if (!formData.estimated_duration_minutes || formData.estimated_duration_minutes <= 0) {
    errors.estimated_duration_minutes = "Duration must be greater than 0";
  } else if (formData.estimated_duration_minutes > 1440) {
    errors.estimated_duration_minutes = "Duration cannot exceed 24 hours (1440 minutes)";
  }
  
  return errors;
};

export const validateShiftForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!formData.driver_id) {
    errors.driver_id = "Driver selection is required";
  }
  
  if (!formData.bus_id) {
    errors.bus_id = "Bus selection is required";
  }
  
  if (!formData.route_id) {
    errors.route_id = "Route selection is required";
  }
  
  if (!formData.shift_date) {
    errors.shift_date = "Shift date is required";
  } else {
    const selectedDate = new Date(formData.shift_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.shift_date = "Shift date cannot be in the past";
    }
  }
  
  if (!formData.shift_time) {
    errors.shift_time = "Shift time is required";
  }
  
  return errors;
};