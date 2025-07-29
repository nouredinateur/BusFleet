import { Driver, Bus, Route, Shift } from "@/components/dashboard/types";

// Fetch functions
export async function fetchDrivers(): Promise<Driver[]> {
  const response = await fetch("/api/drivers");
  if (!response.ok) throw new Error("Failed to fetch drivers");
  return response.json();
}

export async function fetchBuses(): Promise<Bus[]> {
  const response = await fetch("/api/buses");
  if (!response.ok) throw new Error("Failed to fetch buses");
  return response.json();
}

export async function fetchRoutes(): Promise<Route[]> {
  const response = await fetch("/api/routes");
  if (!response.ok) throw new Error("Failed to fetch routes");
  return response.json();
}

export async function fetchShifts(): Promise<Shift[]> {
  const response = await fetch("/api/shifts");
  if (!response.ok) throw new Error("Failed to fetch shifts");
  return response.json();
}

// Create functions
export async function createDriver(data: Partial<Driver>): Promise<Driver> {
  const response = await fetch("/api/drivers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create driver");
  }
  return response.json();
}

export async function createBus(data: Partial<Bus>): Promise<Bus> {
  const response = await fetch("/api/buses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create bus");
  }
  return response.json();
}

export async function createRoute(data: Partial<Route>): Promise<Route> {
  const response = await fetch("/api/routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create route");
  }
  return response.json();
}

export async function createShift(data: Partial<Shift>): Promise<Shift> {
  const response = await fetch("/api/shifts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create shift");
  }
  return response.json();
}