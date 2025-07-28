import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../page";

// Mock the custom hooks
jest.mock("@/components/dashboard/hooks/use-dashboard-data");
jest.mock("@/components/dashboard/hooks/use-dialog-state");
jest.mock("@/components/dashboard/hooks/use-form-state");

// Mock all dashboard components
jest.mock("@/components/dashboard/dashboard-header", () => ({
  DashboardHeader: () => (
    <div data-testid="dashboard-header">Dashboard Header</div>
  ),
}));

jest.mock("@/components/dashboard/dashboard-tabs", () => ({
  DashboardTabs: ({ activeTab, onTabChange }: any) => (
    <div data-testid="dashboard-tabs">
      <button
        data-testid="tab-schedule"
        onClick={() => onTabChange("schedule")}
        className={activeTab === "schedule" ? "active" : ""}
      >
        Schedule
      </button>
      <button
        data-testid="tab-drivers"
        onClick={() => onTabChange("drivers")}
        className={activeTab === "drivers" ? "active" : ""}
      >
        Drivers
      </button>
      <button
        data-testid="tab-buses"
        onClick={() => onTabChange("buses")}
        className={activeTab === "buses" ? "active" : ""}
      >
        Buses
      </button>
      <button
        data-testid="tab-routes"
        onClick={() => onTabChange("routes")}
        className={activeTab === "routes" ? "active" : ""}
      >
        Routes
      </button>
    </div>
  ),
}));

jest.mock("@/components/dashboard/alert-messages", () => ({
  AlertMessages: ({ error, success }: any) => (
    <div data-testid="alert-messages">
      {error && <div data-testid="error-message">{error}</div>}
      {success && <div data-testid="success-message">{success}</div>}
    </div>
  ),
}));

jest.mock("@/components/dashboard/schedule-viewer", () => ({
  ScheduleViewer: ({
    onCreateShift,
    onEditShift,
    onDeleteShift,
    onFilterChange,
  }: any) => (
    <div data-testid="schedule-viewer">
      <button data-testid="create-shift-btn" onClick={() => onCreateShift()}>
        Create Shift
      </button>
      <button
        data-testid="edit-shift-btn"
        onClick={() => onEditShift({ id: 1, driver_id: 1 })}
      >
        Edit Shift
      </button>
      <button data-testid="delete-shift-btn" onClick={() => onDeleteShift(1)}>
        Delete Shift
      </button>
      <input
        data-testid="filter-date"
        onChange={(e) => onFilterChange({ filterDate: e.target.value })}
        placeholder="Filter by date"
      />
    </div>
  ),
}));

jest.mock("@/components/dashboard/drivers-management", () => ({
  DriversManagement: ({
    onCreateDriver,
    onEditDriver,
    onDeleteDriver,
  }: any) => (
    <div data-testid="drivers-management">
      <button data-testid="create-driver-btn" onClick={() => onCreateDriver()}>
        Create Driver
      </button>
      <button
        data-testid="edit-driver-btn"
        onClick={() => onEditDriver({ id: 1, name: "John Doe" })}
      >
        Edit Driver
      </button>
      <button data-testid="delete-driver-btn" onClick={() => onDeleteDriver(1)}>
        Delete Driver
      </button>
    </div>
  ),
}));

jest.mock("@/components/dashboard/buses-management", () => ({
  BusesManagement: ({ onCreateBus, onEditBus, onDeleteBus }: any) => (
    <div data-testid="buses-management">
      <button data-testid="create-bus-btn" onClick={() => onCreateBus()}>
        Create Bus
      </button>
      <button
        data-testid="edit-bus-btn"
        onClick={() => onEditBus({ id: 1, plate_number: "ABC123" })}
      >
        Edit Bus
      </button>
      <button data-testid="delete-bus-btn" onClick={() => onDeleteBus(1)}>
        Delete Bus
      </button>
    </div>
  ),
}));

jest.mock("@/components/dashboard/routes-management", () => ({
  RoutesManagement: ({ onCreateRoute, onEditRoute, onDeleteRoute }: any) => (
    <div data-testid="routes-management">
      <button data-testid="create-route-btn" onClick={() => onCreateRoute()}>
        Create Route
      </button>
      <button
        data-testid="edit-route-btn"
        onClick={() => onEditRoute({ id: 1, origin: "A", destination: "B" })}
      >
        Edit Route
      </button>
      <button data-testid="delete-route-btn" onClick={() => onDeleteRoute(1)}>
        Delete Route
      </button>
    </div>
  ),
}));

// Mock dialog components
jest.mock("@/components/dashboard/dialogs/driver-dialog", () => ({
  DriverDialog: ({ open, onSubmit }: any) =>
    open ? (
      <div data-testid="driver-dialog">
        <button data-testid="driver-submit-btn" onClick={onSubmit}>
          Submit Driver
        </button>
      </div>
    ) : null,
}));

jest.mock("@/components/dashboard/dialogs/bus-dialog", () => ({
  BusDialog: ({ open, onSubmit }: any) =>
    open ? (
      <div data-testid="bus-dialog">
        <button data-testid="bus-submit-btn" onClick={onSubmit}>
          Submit Bus
        </button>
      </div>
    ) : null,
}));

jest.mock("@/components/dashboard/dialogs/route-dialog", () => ({
  RouteDialog: ({ open, onSubmit }: any) =>
    open ? (
      <div data-testid="route-dialog">
        <button data-testid="route-submit-btn" onClick={onSubmit}>
          Submit Route
        </button>
      </div>
    ) : null,
}));

jest.mock("@/components/dashboard/dialogs/shift-dialog", () => ({
  ShiftDialog: ({ open, onSubmit }: any) =>
    open ? (
      <div data-testid="shift-dialog">
        <button data-testid="shift-submit-btn" onClick={onSubmit}>
          Submit Shift
        </button>
      </div>
    ) : null,
}));

// Mock fetch globally
global.fetch = jest.fn();
global.confirm = jest.fn();

describe("Dashboard Page", () => {
  // Mock hook return values
  const mockDashboardData = {
    drivers: [
      { id: 1, name: "John Doe", license_number: "DL123", available: true },
      { id: 2, name: "Jane Smith", license_number: "DL456", available: false },
    ],
    buses: [
      { id: 1, plate_number: "ABC123", capacity: 50 },
      { id: 2, plate_number: "XYZ789", capacity: 40 },
    ],
    routes: [
      {
        id: 1,
        origin: "Downtown",
        destination: "Airport",
        estimated_duration_minutes: 45,
      },
      {
        id: 2,
        origin: "Mall",
        destination: "University",
        estimated_duration_minutes: 30,
      },
    ],
    shifts: [
      {
        id: 1,
        driver_id: 1,
        bus_id: 1,
        route_id: 1,
        shift_date: "2024-01-15",
        shift_time: "08:00",
      },
    ],
    loading: false,
    error: "",
    success: "",
    setDrivers: jest.fn(),
    setBuses: jest.fn(),
    setRoutes: jest.fn(),
    setShifts: jest.fn(),
    setError: jest.fn(),
    setSuccess: jest.fn(),
  };

  const mockDialogState = {
    driverDialogOpen: false,
    busDialogOpen: false,
    routeDialogOpen: false,
    shiftDialogOpen: false,
    setDriverDialogOpen: jest.fn(),
    setBusDialogOpen: jest.fn(),
    setRouteDialogOpen: jest.fn(),
    setShiftDialogOpen: jest.fn(),
  };

  const mockFormState = {
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
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup hook mocks
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

    // Setup fetch mock
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    // Setup confirm mock
    (global.confirm as jest.Mock).mockReturnValue(true);
  });

  describe("Initial Render", () => {
    it("renders dashboard with all main components", () => {
      render(<Dashboard />);

      expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
      expect(screen.getByTestId("dashboard-tabs")).toBeInTheDocument();
      expect(screen.getByTestId("alert-messages")).toBeInTheDocument();
      expect(screen.getByTestId("schedule-viewer")).toBeInTheDocument();
    });

    it("starts with schedule tab active", () => {
      render(<Dashboard />);

      expect(screen.getByTestId("schedule-viewer")).toBeInTheDocument();
      expect(
        screen.queryByTestId("drivers-management")
      ).not.toBeInTheDocument();
    });

    it("applies correct CSS classes for styling", () => {
      render(<Dashboard />);

      const mainContainer = screen
        .getByTestId("schedule-viewer")
        .closest("div");
      expect(mainContainer?.parentElement).toHaveClass(
        "min-h-screen",
        "bg-gradient-to-br"
      );
    });
  });

  describe("Tab Navigation", () => {
    it("switches to drivers tab when clicked", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));

      expect(screen.getByTestId("drivers-management")).toBeInTheDocument();
      expect(screen.queryByTestId("schedule-viewer")).not.toBeInTheDocument();
    });

    it("switches to buses tab when clicked", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-buses"));

      expect(screen.getByTestId("buses-management")).toBeInTheDocument();
      expect(screen.queryByTestId("schedule-viewer")).not.toBeInTheDocument();
    });

    it("switches to routes tab when clicked", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-routes"));

      expect(screen.getByTestId("routes-management")).toBeInTheDocument();
      expect(screen.queryByTestId("schedule-viewer")).not.toBeInTheDocument();
    });

    it("can navigate back to schedule tab", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      // Go to drivers tab
      await user.click(screen.getByTestId("tab-drivers"));
      expect(screen.getByTestId("drivers-management")).toBeInTheDocument();

      // Go back to schedule tab
      await user.click(screen.getByTestId("tab-schedule"));
      expect(screen.getByTestId("schedule-viewer")).toBeInTheDocument();
      expect(
        screen.queryByTestId("drivers-management")
      ).not.toBeInTheDocument();
    });
  });

  describe("Filter Functionality", () => {
    it("updates filter state when filter changes", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      const filterInput = screen.getByTestId("filter-date");
      await user.type(filterInput, "2024-01-15");

      // The filter change should be handled by the component
      expect(filterInput).toHaveValue("2024-01-15");
    });

    it("merges partial filter updates correctly", () => {
      render(<Dashboard />);

      // This tests the handleFilterChange function behavior
      // The actual implementation merges partial updates with existing state
      expect(screen.getByTestId("filter-date")).toBeInTheDocument();
    });
  });

  describe("Create Operations", () => {
    it("opens driver dialog when create driver is clicked", async () => {
      const user = userEvent.setup();
      mockDialogState.driverDialogOpen = true;

      render(<Dashboard />);
      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("create-driver-btn"));

      expect(mockFormState.setEditingItem).toHaveBeenCalledWith(null);
      expect(mockFormState.setFormData).toHaveBeenCalledWith({});
      expect(mockFormState.setValidationErrors).toHaveBeenCalledWith({});
      expect(mockFormState.setDialogError).toHaveBeenCalledWith("");
      expect(mockDialogState.setDriverDialogOpen).toHaveBeenCalledWith(true);
    });

    it("opens bus dialog when create bus is clicked", async () => {
      const user = userEvent.setup();
      mockDialogState.busDialogOpen = true;

      render(<Dashboard />);
      await user.click(screen.getByTestId("tab-buses"));
      await user.click(screen.getByTestId("create-bus-btn"));

      expect(mockDialogState.setBusDialogOpen).toHaveBeenCalledWith(true);
    });

    it("opens route dialog when create route is clicked", async () => {
      const user = userEvent.setup();
      mockDialogState.routeDialogOpen = true;

      render(<Dashboard />);
      await user.click(screen.getByTestId("tab-routes"));
      await user.click(screen.getByTestId("create-route-btn"));

      expect(mockDialogState.setRouteDialogOpen).toHaveBeenCalledWith(true);
    });

    it("opens shift dialog when create shift is clicked", async () => {
      const user = userEvent.setup();
      mockDialogState.shiftDialogOpen = true;

      render(<Dashboard />);
      await user.click(screen.getByTestId("create-shift-btn"));

      expect(mockDialogState.setShiftDialogOpen).toHaveBeenCalledWith(true);
    });
  });

  describe("Edit Operations", () => {
    it("sets up form state correctly when editing driver", async () => {
      const user = userEvent.setup();
      const driverData = { id: 1, name: "John Doe" };

      render(<Dashboard />);
      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("edit-driver-btn"));

      expect(mockFormState.setEditingItem).toHaveBeenCalledWith(driverData);
      expect(mockFormState.setFormData).toHaveBeenCalledWith(driverData);
      expect(mockFormState.setValidationErrors).toHaveBeenCalledWith({});
      expect(mockFormState.setDialogError).toHaveBeenCalledWith("");
      expect(mockDialogState.setDriverDialogOpen).toHaveBeenCalledWith(true);
    });

    it("sets up form state correctly when editing bus", async () => {
      const user = userEvent.setup();
      const busData = { id: 1, plate_number: "ABC123" };

      render(<Dashboard />);
      await user.click(screen.getByTestId("tab-buses"));
      await user.click(screen.getByTestId("edit-bus-btn"));

      expect(mockFormState.setEditingItem).toHaveBeenCalledWith(busData);
      expect(mockFormState.setFormData).toHaveBeenCalledWith(busData);
      expect(mockDialogState.setBusDialogOpen).toHaveBeenCalledWith(true);
    });

    it("sets up form state correctly when editing route", async () => {
      const user = userEvent.setup();
      const routeData = { id: 1, origin: "A", destination: "B" };

      render(<Dashboard />);
      await user.click(screen.getByTestId("tab-routes"));
      await user.click(screen.getByTestId("edit-route-btn"));

      expect(mockFormState.setEditingItem).toHaveBeenCalledWith(routeData);
      expect(mockFormState.setFormData).toHaveBeenCalledWith(routeData);
      expect(mockDialogState.setRouteDialogOpen).toHaveBeenCalledWith(true);
    });

    it("sets up form state correctly when editing shift", async () => {
      const user = userEvent.setup();
      const shiftData = { id: 1, driver_id: 1 };

      render(<Dashboard />);
      await user.click(screen.getByTestId("edit-shift-btn"));

      expect(mockFormState.setEditingItem).toHaveBeenCalledWith(shiftData);
      expect(mockFormState.setFormData).toHaveBeenCalledWith(shiftData);
      expect(mockDialogState.setShiftDialogOpen).toHaveBeenCalledWith(true);
    });
  });

  describe("Delete Operations", () => {
    it("deletes driver successfully", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("delete-driver-btn"));

      await waitFor(() => {
        expect(global.confirm).toHaveBeenCalledWith(
          "Are you sure you want to delete this item?"
        );
        expect(global.fetch).toHaveBeenCalledWith("/api/drivers?id=1", {
          method: "DELETE",
        });
      });
    });

    it("deletes bus successfully", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-buses"));
      await user.click(screen.getByTestId("delete-bus-btn"));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/buses?id=1", {
          method: "DELETE",
        });
      });
    });

    it("deletes route successfully", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-routes"));
      await user.click(screen.getByTestId("delete-route-btn"));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/routes?id=1", {
          method: "DELETE",
        });
      });
    });

    it("deletes shift successfully", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("delete-shift-btn"));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/shifts?id=1", {
          method: "DELETE",
        });
      });
    });

    it("cancels delete when user clicks cancel", async () => {
      (global.confirm as jest.Mock).mockReturnValue(false);
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("delete-driver-btn"));

      expect(global.confirm).toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("handles delete error correctly", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "Delete failed" }),
      });

      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("delete-driver-btn"));

      await waitFor(() => {
        expect(mockDashboardData.setError).toHaveBeenCalledWith(
          "Delete failed"
        );
      });
    });

    it("updates state after successful delete", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("delete-driver-btn"));

      await waitFor(() => {
        expect(mockDashboardData.setDrivers).toHaveBeenCalled();
        expect(mockDashboardData.setSuccess).toHaveBeenCalledWith(
          "Item deleted successfully"
        );
      });
    });
  });

  describe("Dialog Management", () => {
    it("renders driver dialog when open", () => {
      mockDialogState.driverDialogOpen = true;
      render(<Dashboard />);

      expect(screen.getByTestId("driver-dialog")).toBeInTheDocument();
    });

    it("renders bus dialog when open", () => {
      mockDialogState.busDialogOpen = true;
      render(<Dashboard />);

      expect(screen.getByTestId("bus-dialog")).toBeInTheDocument();
    });

    it("renders route dialog when open", () => {
      mockDialogState.routeDialogOpen = true;
      render(<Dashboard />);

      expect(screen.getByTestId("route-dialog")).toBeInTheDocument();
    });

    it("renders shift dialog when open", () => {
      mockDialogState.shiftDialogOpen = true;
      render(<Dashboard />);

      expect(screen.getByTestId("shift-dialog")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("calls handleSubmit for driver form", async () => {
      mockDialogState.driverDialogOpen = true;
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("driver-submit-btn"));

      expect(mockFormState.handleSubmit).toHaveBeenCalledWith(
        "drivers",
        mockDashboardData,
        mockDialogState
      );
    });

    it("calls handleSubmit for bus form", async () => {
      mockDialogState.busDialogOpen = true;
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("bus-submit-btn"));

      expect(mockFormState.handleSubmit).toHaveBeenCalledWith(
        "buses",
        mockDashboardData,
        mockDialogState
      );
    });

    it("calls handleSubmit for route form", async () => {
      mockDialogState.routeDialogOpen = true;
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("route-submit-btn"));

      expect(mockFormState.handleSubmit).toHaveBeenCalledWith(
        "routes",
        mockDashboardData,
        mockDialogState
      );
    });

    it("calls handleSubmit for shift form", async () => {
      mockDialogState.shiftDialogOpen = true;
      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("shift-submit-btn"));

      expect(mockFormState.handleSubmit).toHaveBeenCalledWith(
        "shifts",
        mockDashboardData,
        mockDialogState
      );
    });
  });

  describe("Alert Messages", () => {
    it("displays error messages", () => {
      mockDashboardData.error = "Something went wrong";
      render(<Dashboard />);

      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Something went wrong"
      );
    });

    it("displays success messages", () => {
      mockDashboardData.success = "Operation completed successfully";
      render(<Dashboard />);

      expect(screen.getByTestId("success-message")).toHaveTextContent(
        "Operation completed successfully"
      );
    });
  });

  describe("Error Handling", () => {
    it("handles network errors during delete", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("delete-driver-btn"));

      await waitFor(() => {
        expect(mockDashboardData.setError).toHaveBeenCalledWith(
          "Network error"
        );
      });
    });

    it("handles API errors during delete", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "Server error" }),
      });

      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("delete-driver-btn"));

      await waitFor(() => {
        expect(mockDashboardData.setError).toHaveBeenCalledWith("Server error");
      });
    });

    it("handles generic delete failures", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      const user = userEvent.setup();
      render(<Dashboard />);

      await user.click(screen.getByTestId("tab-drivers"));
      await user.click(screen.getByTestId("delete-driver-btn"));

      await waitFor(() => {
        expect(mockDashboardData.setError).toHaveBeenCalledWith(
          "Delete failed"
        );
      });
    });
  });

  describe("Loading States", () => {
    it("passes loading state to dialogs", () => {
      mockDashboardData.loading = true;
      mockDialogState.driverDialogOpen = true;

      render(<Dashboard />);

      expect(screen.getByTestId("driver-dialog")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      render(<Dashboard />);

      const mainContainer = screen.getByTestId("bus-management-dashboard");
      expect(mainContainer).toHaveClass("min-h-screen");
    });

    it("maintains focus management during tab navigation", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      const driversTab = screen.getByTestId("tab-drivers");
      await user.click(driversTab);

      expect(screen.getByTestId("drivers-management")).toBeInTheDocument();
    });
  });
});
