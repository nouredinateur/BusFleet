import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDrivers, fetchBuses, fetchRoutes, fetchShifts } from "@/lib/api";
import { useState } from "react";
import { Driver, Bus, Route, Shift } from "../types";

export function useDashboardData(activeTab?: string) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const queryClient = useQueryClient();

  // Only fetch data for active tab and schedule (which needs all data)
  const shouldFetchDrivers = !activeTab || activeTab === "schedule" || activeTab === "drivers";
  const shouldFetchBuses = !activeTab || activeTab === "schedule" || activeTab === "buses";
  const shouldFetchRoutes = !activeTab || activeTab === "schedule" || activeTab === "routes";
  const shouldFetchShifts = !activeTab || activeTab === "schedule";

  const {
    data: drivers = [],
    isLoading: driversLoading,
    error: driversError,
  } = useQuery({
    queryKey: ["drivers"],
    queryFn: fetchDrivers,
    enabled: shouldFetchDrivers,
  });

  const {
    data: buses = [],
    isLoading: busesLoading,
    error: busesError,
  } = useQuery({
    queryKey: ["buses"],
    queryFn: fetchBuses,
    enabled: shouldFetchBuses,
  });

  const {
    data: routes = [],
    isLoading: routesLoading,
    error: routesError,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: fetchRoutes,
    enabled: shouldFetchRoutes,
  });

  const {
    data: shifts = [],
    isLoading: shiftsLoading,
    error: shiftsError,
  } = useQuery({
    queryKey: ["shifts"],
    queryFn: fetchShifts,
    enabled: shouldFetchShifts,
  });

  const loading = driversLoading || busesLoading || routesLoading || shiftsLoading;
  const queryError = driversError || busesError || routesError || shiftsError;

  // Setter functions that work with React Query
  const setDrivers = (newDrivers: Driver[]) => {
    queryClient.setQueryData(["drivers"], newDrivers);
  };

  const setBuses = (newBuses: Bus[]) => {
    queryClient.setQueryData(["buses"], newBuses);
  };

  const setRoutes = (newRoutes: Route[]) => {
    queryClient.setQueryData(["routes"], newRoutes);
  };

  const setShifts = (newShifts: Shift[]) => {
    queryClient.setQueryData(["shifts"], newShifts);
  };

  const loadAllData = () => {
    queryClient.invalidateQueries({ queryKey: ["drivers"] });
    queryClient.invalidateQueries({ queryKey: ["buses"] });
    queryClient.invalidateQueries({ queryKey: ["routes"] });
    queryClient.invalidateQueries({ queryKey: ["shifts"] });
  };

  return {
    drivers,
    buses,
    routes,
    shifts,
    loading,
    error: error || queryError?.message || "",
    success,
    // Setter methods expected by the form logic
    setDrivers,
    setBuses,
    setRoutes,
    setShifts,
    setError,
    setSuccess,
    loadAllData,
  };
}