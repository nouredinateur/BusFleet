export interface Driver {
  id: number;
  name: string;
  license_number: string;
  available: boolean;
}

export interface Bus {
  id: number;
  plate_number: string;
  capacity: number;
}

export interface Route {
  id: number;
  origin: string;
  destination: string;
  estimated_duration_minutes: number;
}

export interface Shift {
  id: number;
  driver_id: number;
  bus_id: number;
  route_id: number;
  shift_date: string;
  shift_time: string;
  driver?: Driver;
  bus?: Bus;
  route?: Route;
}

export interface FormData {
  name?: string;
  license_number?: string;
  available?: boolean;
  plate_number?: string;
  capacity?: number;
  origin?: string;
  destination?: string;
  estimated_duration_minutes?: number;
  driver_id?: number;
  bus_id?: number;
  route_id?: number;
  shift_date?: string;
  shift_time?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface DashboardState {
  drivers: Driver[];
  buses: Bus[];
  routes: Route[];
  shifts: Shift[];
  loading: boolean;
  error: string;
  success: string;
}

export interface DialogState {
  driverDialogOpen: boolean;
  busDialogOpen: boolean;
  routeDialogOpen: boolean;
  shiftDialogOpen: boolean;
}

export interface FormState {
  editingItem: Driver | Bus | Route | Shift | null;
  formData: FormData;
  validationErrors: ValidationErrors;
  dialogError: string;
}

export interface FilterState {
  filterDate: string;
  filterDriver: string;
  filterBus: string;
}

export type TabType = "schedule" | "drivers" | "buses" | "routes";

export interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}