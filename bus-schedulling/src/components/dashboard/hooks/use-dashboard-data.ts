import { useQuery } from "@tanstack/react-query";
import { fetchDrivers, fetchBuses, fetchRoutes, fetchShifts } from "@/lib/api";

export function useDashboardData() {
  const {
    data: drivers = [],
    isLoading: driversLoading,
    error: driversError,
  } = useQuery({
    queryKey: ["drivers"],
    queryFn: fetchDrivers,
  });

  const {
    data: buses = [],
    isLoading: busesLoading,
    error: busesError,
  } = useQuery({
    queryKey: ["buses"],
    queryFn: fetchBuses,
  });

  const {
    data: routes = [],
    isLoading: routesLoading,
    error: routesError,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: fetchRoutes,
  });

  const {
    data: shifts = [],
    isLoading: shiftsLoading,
    error: shiftsError,
  } = useQuery({
    queryKey: ["shifts"],
    queryFn: fetchShifts,
  });

  const loading = driversLoading || busesLoading || routesLoading || shiftsLoading;
  const error = driversError || busesError || routesError || shiftsError;

  return {
    drivers,
    buses,
    routes,
    shifts,
    loading,
    error: error?.message || "",
    success: "", // You can manage success messages separately
  };
}