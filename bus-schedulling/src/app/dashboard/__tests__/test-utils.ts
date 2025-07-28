import React from "react";
import { render, RenderOptions } from "@testing-library/react";

// Mock data factories
export const createMockDriver = (overrides = {}) => ({
  id: 1,
  name: "John Doe",
  license_number: "DL123456",
  available: true,
  ...overrides,
});

export const createMockBus = (overrides = {}) => ({
  id: 1,
  plate_number: "ABC123",
  capacity: 50,
  ...overrides,
});

export const createMockRoute = (overrides = {}) => ({
  id: 1,
  origin: "Downtown",
  destination: "Airport",
  estimated_duration_minutes: 45,
  ...overrides,
});

export const createMockShift = (overrides = {}) => ({
  id: 1,
  driver_id: 1,
  bus_id: 1,
  route_id: 1,
  shift_date: "2024-01-15",
  shift_time: "08:00",
  ...overrides,
});

export const createMockDashboardData = (overrides = {}) => ({
  drivers: [createMockDriver()],
  buses: [createMockBus()],
  routes: [createMockRoute()],
  shifts: [createMockShift()],
  loading: false,
  error: "",
  success: "",
  setDrivers: jest.fn(),
  setBuses: jest.fn(),
  setRoutes: jest.fn(),
  setShifts: jest.fn(),
  setError: jest.fn(),
  setSuccess: jest.fn(),
  setLoading: jest.fn(),
  loadAllData: jest.fn(),
  ...overrides,
});

export const createMockDialogState = (overrides = {}) => ({
  driverDialogOpen: false,
  busDialogOpen: false,
  routeDialogOpen: false,
  shiftDialogOpen: false,
  setDriverDialogOpen: jest.fn(),
  setBusDialogOpen: jest.fn(),
  setRouteDialogOpen: jest.fn(),
  setShiftDialogOpen: jest.fn(),
  ...overrides,
});

export const createMockFormState = (overrides = {}) => ({
  editingItem: null,
  formData: {},
  validationErrors: {},
  dialogError: "",
  setEditingItem: jest.fn(),
  setFormData: jest.fn(),
  updateFormData: jest.fn(),
  setValidationErrors: jest.fn(),
  setDialogError: jest.fn(),
  handleSubmit: jest.fn(),
  ...overrides,
});

// Custom render function with providers if needed
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(ui, options);
};

// Mock fetch responses
export const mockFetchSuccess = (data = { success: true }) => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
};

export const mockFetchError = (error = "Server error", status = 500) => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error }),
  });
};

export const mockFetchNetworkError = () => {
  (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
};

// Helper to setup all mocks
export const setupMocks = (
  dashboardData = {},
  dialogState = {},
  formState = {}
) => {
  const mockDashboardData = createMockDashboardData(dashboardData);
  const mockDialogState = createMockDialogState(dialogState);
  const mockFormState = createMockFormState(formState);

  const {
    useDashboardData,
  } = require("@/components/dashboard/hooks/use-dashboard-data");
  const {
    useDialogState,
  } = require("@/components/dashboard/hooks/use-dialog-state");
  const {
    useFormState,
  } = require("@/components/dashboard/hooks/use-form-state");

  useDashboardData.mockReturnValue(mockDashboardData);
  useDialogState.mockReturnValue(mockDialogState);
  useFormState.mockReturnValue(mockFormState);

  return {
    mockDashboardData,
    mockDialogState,
    mockFormState,
  };
};
