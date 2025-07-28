import { useState, useEffect } from "react";
import { DashboardState, Driver, Bus, Route, Shift } from "../types";

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({
    drivers: [],
    buses: [],
    routes: [],
    shifts: [],
    loading: false,
    error: "",
    success: "",
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error }));
  };

  const setSuccess = (success: string) => {
    setState(prev => ({ ...prev, success }));
  };

  const setDrivers = (drivers: Driver[]) => {
    setState(prev => ({ ...prev, drivers }));
  };

  const setBuses = (buses: Bus[]) => {
    setState(prev => ({ ...prev, buses }));
  };

  const setRoutes = (routes: Route[]) => {
    setState(prev => ({ ...prev, routes }));
  };

  const setShifts = (shifts: Shift[]) => {
    setState(prev => ({ ...prev, shifts }));
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [driversRes, busesRes, routesRes, shiftsRes] = await Promise.all([
        fetch("/api/drivers"),
        fetch("/api/buses"),
        fetch("/api/routes"),
        fetch("/api/shifts"),
      ]);

      if (driversRes.ok) setDrivers(await driversRes.json());
      if (busesRes.ok) setBuses(await busesRes.json());
      if (routesRes.ok) setRoutes(await routesRes.json());
      if (shiftsRes.ok) setShifts(await shiftsRes.json());
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    setDrivers,
    setBuses,
    setRoutes,
    setShifts,
    loadAllData,
  };
}