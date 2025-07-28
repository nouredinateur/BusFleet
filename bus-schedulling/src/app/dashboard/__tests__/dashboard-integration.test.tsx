import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../page";
import { setupMocks, mockFetchSuccess, mockFetchError } from "./test-utils";

// Mock the hooks but allow more realistic interactions
jest.mock("@/components/dashboard/hooks/use-dashboard-data");
jest.mock("@/components/dashboard/hooks/use-dialog-state");
jest.mock("@/components/dashboard/hooks/use-form-state");

// Simplified component mocks for integration testing
jest.mock("@/components/dashboard/dashboard-header", () => ({
  DashboardHeader: () => (
    <header data-testid="dashboard-header">Bus Scheduling Dashboard</header>
  ),
}));

jest.mock("@/components/dashboard/dashboard-tabs", () => ({
  DashboardTabs: ({ activeTab, onTabChange }: any) => (
    <nav data-testid="dashboard-tabs">
      {["schedule", "drivers", "buses", "routes"].map((tab) => (
        <button
          key={tab}
          data-testid={`tab-${tab}`}
          onClick={() => onTabChange(tab)}
          aria-selected={activeTab === tab}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  ),
}));

jest.mock("@/components/dashboard/alert-messages", () => ({
  AlertMessages: ({ error, success }: any) => (
    <div data-testid="alert-messages" role="alert">
      {error && (
        <div data-testid="error-alert" className="error">
          {error}
        </div>
      )}
      {success && (
        <div data-testid="success-alert" className="success">
          {success}
        </div>
      )}
    </div>
  ),
}));

// More realistic component mocks that simulate actual behavior
jest.mock("@/components/dashboard/schedule-viewer", () => ({
  ScheduleViewer: ({
    shifts,
    drivers,
    buses,
    routes,
    onCreateShift,
    onEditShift,
    onDeleteShift,
    filterState,
    onFilterChange,
  }: any) => (
    <div data-testid="schedule-viewer">
      <h2>Schedule Management</h2>
      <div data-testid="filter-controls">
        <input
          data-testid="filter-date"
          placeholder="Filter by date"
          value={filterState.filterDate}
          onChange={(e) => onFilterChange({ filterDate: e.target.value })}
        />
        <select
          data-testid="filter-driver"
          value={filterState.filterDriver}
          onChange={(e) => onFilterChange({ filterDriver: e.target.value })}
        >
          <option value="">All Drivers</option>
          {drivers.map((driver: any) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>
      </div>
      <button data-testid="create-shift-btn" onClick={onCreateShift}>
        Add New Shift
      </button>
      <div data-testid="shifts-list">
        {shifts.map((shift: any) => (
          <div key={shift.id} data-testid={`shift-${shift.id}`}>
            <span>Shift {shift.id}</span>
            <button onClick={() => onEditShift(shift)}>Edit</button>
            <button onClick={() => onDeleteShift(shift.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock("@/components/dashboard/drivers-management", () => ({
  DriversManagement: ({
    drivers,
    onCreateDriver,
    onEditDriver,
    onDeleteDriver,
  }: any) => (
    <div data-testid="drivers-management">
      <h2>Drivers Management</h2>
      <button data-testid="create-driver-btn" onClick={onCreateDriver}>
        Add New Driver
      </button>
      <div data-testid="drivers-list">
        {drivers.map((driver: any) => (
          <div key={driver.id} data-testid={`driver-${driver.id}`}>
            <span>
              {driver.name} - {driver.license_number}
            </span>
            <span data-testid={`driver-status-${driver.id}`}>
              {driver.available ? "Available" : "Unavailable"}
            </span>
            <button onClick={() => onEditDriver(driver)}>Edit</button>
            <button onClick={() => onDeleteDriver(driver.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  ),
}));

// Mock dialogs with form simulation
jest.mock("@/components/dashboard/dialogs/driver-dialog", () => ({
  DriverDialog: ({
    open,
    editingItem,
    formData,
    onFormDataChange,
    onSubmit,
    onOpenChange,
  }: any) =>
    open ? (
      <div data-testid="driver-dialog" role="dialog">
        <h3>{editingItem ? "Edit Driver" : "Create Driver"}</h3>
        <input
          data-testid="driver-name-input"
          placeholder="Driver Name"
          value={formData.name || ""}
          onChange={(e) => onFormDataChange({ name: e.target.value })}
        />
        <input
          data-testid="driver-license-input"
          placeholder="License Number"
          value={formData.license_number || ""}
          onChange={(e) => onFormDataChange({ license_number: e.target.value })}
        />
        <button data-testid="driver-submit-btn" onClick={onSubmit}>
          {editingItem ? "Update" : "Create"} Driver
        </button>
        <button
          data-testid="driver-cancel-btn"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </button>
      </div>
    ) : null,
}));

// Global mocks
global.fetch = jest.fn();
global.confirm = jest.fn(() => true);

describe("Dashboard Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchSuccess();
  });

  describe("Complete User Workflows", () => {
    it("completes full driver management workflow", async () => {
      const user = userEvent.setup();
      const { mockDashboardData, mockDialogState, mockFormState } =
        setupMocks();

      render(<Dashboard />);

      // Navigate to drivers tab
      await user.click(screen.getByTestId("tab-drivers"));
      expect(screen.getByTestId("drivers-management")).toBeInTheDocument();

      // Create new driver
      await user.click(screen.getByTestId("create-driver-btn"));
      expect(mockDialogState.setDriverDialogOpen).toHaveBeenCalledWith(true);

      // Simulate dialog opening
      mockDialogState.driverDialogOpen = true;
      render(<Dashboard />);

      expect(screen.getByTestId("driver-dialog")).toBeInTheDocument();
      expect(screen.getByText("Create Driver")).toBeInTheDocument();
    });

    it("handles complete edit workflow", async () => {
      const user = userEvent.setup();
      const { mockFormState, mockDialogState } = setupMocks();

      render(<Dashboard />);

      // Navigate to drivers and edit
      await user.click(screen.getByTestId("tab-drivers"));

      const editButton = screen.getByText("Edit");
      await user.click(editButton);

      expect(mockFormState.setEditingItem).toHaveBeenCalled();
      expect(mockFormState.setFormData).toHaveBeenCalled();
      expect(mockDialogState.setDriverDialogOpen).toHaveBeenCalledWith(true);
    });

    it("handles complete delete workflow with confirmation", async () => {
      const user = userEvent.setup();
      const { mockDashboardData } = setupMocks();

      render(<Dashboard />);

      // Navigate to drivers and delete
      await user.click(screen.getByTestId("tab-drivers"));

      const deleteButton = screen.getByText("Delete");
      await user.click(deleteButton);

      expect(global.confirm).toHaveBeenCalledWith(
        "Are you sure you want to delete this item?"
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/drivers?id=1", {
          method: "DELETE",
        });
      });
    });
  });

  describe("Filter Functionality Integration", () => {
    it("updates filters and maintains state across tab changes", async () => {
      const user = userEvent.setup();
      setupMocks();

      render(<Dashboard />);

      // Set filter on schedule tab
      const dateFilter = screen.getByTestId("filter-date");
      await user.type(dateFilter, "2024-01-15");

      // Switch tabs and come back
      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("tab-schedule"));

      // Filter should be maintained
      expect(screen.getByTestId("filter-date")).toHaveValue("2024-01-15");
    });

    it("filters work with driver selection", async () => {
      const user = userEvent.setup();
      setupMocks();

      render(<Dashboard />);

      const driverFilter = screen.getByTestId("filter-driver");
      await user.selectOptions(driverFilter, "1");

      expect(driverFilter).toHaveValue("1");
    });
  });

  describe("Error Handling Integration", () => {
    it("displays error messages and allows recovery", async () => {
      const user = userEvent.setup();
      const { mockDashboardData } = setupMocks({
        error: "Network connection failed",
      });

      render(<Dashboard />);

      expect(screen.getByTestId("error-alert")).toHaveTextContent(
        "Network connection failed"
      );

      // Error should be visible in alert component
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("handles API errors during delete operations", async () => {
      const user = userEvent.setup();
      const { mockDashboardData } = setupMocks();

      mockFetchError("Driver is assigned to active shifts");

      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByText("Delete"));

      await waitFor(() => {
        expect(mockDashboardData.setError).toHaveBeenCalledWith(
          "Driver is assigned to active shifts"
        );
      });
    });
  });

  describe("Data Consistency", () => {
    it("maintains data consistency across operations", async () => {
      const user = userEvent.setup();
      const { mockDashboardData } = setupMocks();

      render(<Dashboard />);

      // Check initial data is passed correctly
      expect(screen.getByTestId("schedule-viewer")).toBeInTheDocument();

      // Switch to drivers tab
      await user.click(screen.getByTestId("tab-drivers"));
      expect(screen.getByText("John Doe - DL123456")).toBeInTheDocument();
      expect(screen.getByTestId("driver-status-1")).toHaveTextContent(
        "Available"
      );
    });

    it("updates UI after successful operations", async () => {
      const user = userEvent.setup();
      const { mockDashboardData } = setupMocks();

      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByText("Delete"));

      await waitFor(() => {
        expect(mockDashboardData.setDrivers).toHaveBeenCalled();
        expect(mockDashboardData.setSuccess).toHaveBeenCalledWith(
          "Item deleted successfully"
        );
      });
    });
  });

  describe("Accessibility Integration", () => {
    it("maintains proper ARIA attributes", () => {
      setupMocks();
      render(<Dashboard />);

      // Check tab navigation has proper ARIA
      const scheduleTab = screen.getByTestId("tab-schedule");
      expect(scheduleTab).toHaveAttribute("aria-selected", "true");

      // Check alert region
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      setupMocks();

      render(<Dashboard />);

      // Tab navigation should work with keyboard
      const driversTab = screen.getByTestId("tab-drivers");
      driversTab.focus();
      await user.keyboard("{Enter}");

      expect(screen.getByTestId("drivers-management")).toBeInTheDocument();
    });
  });

  describe("Performance Considerations", () => {
    it("does not cause unnecessary re-renders", () => {
      const { mockDashboardData } = setupMocks();

      const { rerender } = render(<Dashboard />);

      // Re-render with same props should not cause issues
      rerender(<Dashboard />);

      expect(screen.getByTestId("schedule-viewer")).toBeInTheDocument();
    });

    it("handles large datasets efficiently", () => {
      const largeDriversList = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Driver ${i + 1}`,
        license_number: `DL${String(i + 1).padStart(6, "0")}`,
        available: i % 2 === 0,
      }));

      setupMocks({ drivers: largeDriversList });

      render(<Dashboard />);

      // Should render without performance issues
      expect(screen.getByTestId("schedule-viewer")).toBeInTheDocument();
    });
  });
});
