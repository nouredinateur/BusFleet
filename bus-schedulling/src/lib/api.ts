import { Driver, Bus, Route, Shift } from "@/components/dashboard/types";

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