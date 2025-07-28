"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Bus,
  Users,
  Route,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Filter,
  LogOut,
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  MapPin,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Driver {
  id: number;
  name: string;
  license_number: string;
  available: boolean;
}

interface Bus {
  id: number;
  plate_number: string;
  capacity: number;
}

interface Route {
  id: number;
  origin: string;
  destination: string;
  estimated_duration_minutes: number;
}

interface Shift {
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

interface FormData {
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog states
  const [driverDialogOpen, setDriverDialogOpen] = useState(false);
  const [busDialogOpen, setBusDialogOpen] = useState(false);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);

  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({});

  // Filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [filterBus, setFilterBus] = useState("");

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

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

  const handleSubmit = async (type: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { id: editingItem.id, ...formData } : formData;

      const response = await fetch(`/api/${type}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Operation failed");
      }

      const result = await response.json();

      if (type === "driver") {
        if (editingItem) {
          setDrivers((prev) =>
            prev.map((d) => (d.id === editingItem.id ? result : d))
          );
          setSuccess("Driver updated successfully");
        } else {
          setDrivers((prev) => [...prev, result]);
          setSuccess("Driver created successfully");
        }
        setDriverDialogOpen(false);
      } else if (type === "bus") {
        if (editingItem) {
          setBuses((prev) =>
            prev.map((b) => (b.id === editingItem.id ? result : b))
          );
          setSuccess("Bus updated successfully");
        } else {
          setBuses((prev) => [...prev, result]);
          setSuccess("Bus created successfully");
        }
        setBusDialogOpen(false);
      } else if (type === "route") {
        if (editingItem) {
          setRoutes((prev) =>
            prev.map((r) => (r.id === editingItem.id ? result : r))
          );
          setSuccess("Route updated successfully");
        } else {
          setRoutes((prev) => [...prev, result]);
          setSuccess("Route created successfully");
        }
        setRouteDialogOpen(false);
      } else if (type === "shift") {
        if (editingItem) {
          setShifts((prev) =>
            prev.map((s) => (s.id === editingItem.id ? result : s))
          );
          setSuccess("Shift updated successfully");
        } else {
          setShifts((prev) => [...prev, result]);
          setSuccess("Shift created successfully");
        }
        setShiftDialogOpen(false);
        // Reload shifts to get the populated data
        const shiftsRes = await fetch("/api/shifts");
        if (shiftsRes.ok) setShifts(await shiftsRes.json());
      }

      setFormData({});
      setEditingItem(null);
    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: string, item: any) => {
    setEditingItem(item);
    setFormData(item);

    if (type === "driver") setDriverDialogOpen(true);
    else if (type === "bus") setBusDialogOpen(true);
    else if (type === "route") setRouteDialogOpen(true);
    else if (type === "shift") setShiftDialogOpen(true);
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/${type}s?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete failed");
      }

      if (type === "driver") {
        setDrivers((prev) => prev.filter((d) => d.id !== id));
      } else if (type === "bus") {
        setBuses((prev) => prev.filter((b) => b.id !== id));
      } else if (type === "route") {
        setRoutes((prev) => prev.filter((r) => r.id !== id));
      } else if (type === "shift") {
        setShifts((prev) => prev.filter((s) => s.id !== id));
      }
      setSuccess("Item deleted successfully");
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  const openCreateDialog = (type: string) => {
    setEditingItem(null);
    setFormData({});

    if (type === "driver") setDriverDialogOpen(true);
    else if (type === "bus") setBusDialogOpen(true);
    else if (type === "route") setRouteDialogOpen(true);
    else if (type === "shift") setShiftDialogOpen(true);
  };

  const getFilteredShifts = () => {
    return shifts.filter((shift) => {
      if (filterDate && shift.shift_date !== filterDate) return false;
      if (filterDriver && shift.driver_id.toString() !== filterDriver)
        return false;
      if (filterBus && shift.bus_id.toString() !== filterBus) return false;
      return true;
    });
  };

  const tabs = [
    { id: "schedule", label: "Schedule Viewer", icon: Calendar },
    { id: "drivers", label: "Drivers", icon: Users },
    { id: "buses", label: "Buses", icon: Bus },
    { id: "routes", label: "Routes", icon: Route },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-persian-blue-50 via-dark-cyan-50 to-platinum-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-platinum-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-persian-blue-500 to-dark-cyan-500 rounded-xl flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-buenard font-bold text-platinum-900">
                  Bus Management Dashboard
                </h1>
                <p className="text-sm text-platinum-600 font-forum">
                  Manage your fleet operations
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="text-platinum-700 hover:text-error-600 hover:border-error-300 font-inknut"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-error-200 bg-error-50">
            <AlertCircle className="h-4 w-4 text-error-600" />
            <AlertDescription className="text-error-700 font-forum">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-success-200 bg-success-50">
            <CheckCircle className="h-4 w-4 text-success-600" />
            <AlertDescription className="text-success-700 font-forum">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-platinum-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-lg font-medium font-inknut transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 text-white shadow-lg"
                    : "text-platinum-700 hover:bg-white/80 hover:text-persian-blue-600"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Schedule Viewer Tab */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-buenard font-bold text-platinum-900">
                Schedule Viewer
              </h2>
              <Button
                onClick={() => openCreateDialog("shift")}
                className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Shift
              </Button>
            </div>

            {/* Filters */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-buenard">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-platinum-800 font-inknut">
                      Date
                    </Label>
                    <Input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="font-forum"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-platinum-800 font-inknut">
                      Driver
                    </Label>
                    <Select
                      value={filterDriver}
                      onValueChange={setFilterDriver}
                    >
                      <SelectTrigger className="font-forum">
                        <SelectValue placeholder="All drivers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All drivers</SelectItem>
                        {drivers.map((driver) => (
                          <SelectItem
                            key={driver.id}
                            value={driver.id.toString()}
                          >
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-platinum-800 font-inknut">
                      Bus
                    </Label>
                    <Select value={filterBus} onValueChange={setFilterBus}>
                      <SelectTrigger className="font-forum">
                        <SelectValue placeholder="All buses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All buses</SelectItem>
                        {buses.map((bus) => (
                          <SelectItem key={bus.id} value={bus.id.toString()}>
                            {bus.plate_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shifts Table */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-inknut">Date</TableHead>
                      <TableHead className="font-inknut">Time</TableHead>
                      <TableHead className="font-inknut">Driver</TableHead>
                      <TableHead className="font-inknut">Bus</TableHead>
                      <TableHead className="font-inknut">Route</TableHead>
                      <TableHead className="font-inknut">Duration</TableHead>
                      <TableHead className="font-inknut">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredShifts().map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell className="font-forum">
                          {shift.shift_date}
                        </TableCell>
                        <TableCell className="font-forum">
                          {shift.shift_time}
                        </TableCell>
                        <TableCell className="font-forum">
                          {shift.driver?.name || "Unknown"}
                        </TableCell>
                        <TableCell className="font-forum">
                          {shift.bus?.plate_number || "Unknown"}
                        </TableCell>
                        <TableCell className="font-forum">
                          {shift.route
                            ? `${shift.route.origin} → ${shift.route.destination}`
                            : "Unknown"}
                        </TableCell>
                        <TableCell className="font-forum">
                          {shift.route?.estimated_duration_minutes || 0} min
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit("shift", shift)}
                              className="text-persian-blue-600 hover:text-persian-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete("shift", shift.id)}
                              className="text-error-600 hover:text-error-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === "drivers" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-buenard font-bold text-platinum-900">
                Driver Management
              </h2>
              <Button
                onClick={() => openCreateDialog("driver")}
                className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Driver
              </Button>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-inknut">Name</TableHead>
                      <TableHead className="font-inknut">
                        License Number
                      </TableHead>
                      <TableHead className="font-inknut">Status</TableHead>
                      <TableHead className="font-inknut">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-forum">
                          {driver.name}
                        </TableCell>
                        <TableCell className="font-forum">
                          {driver.license_number}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={driver.available ? "success" : "secondary"}
                          >
                            {driver.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit("driver", driver)}
                              className="text-persian-blue-600 hover:text-persian-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete("driver", driver.id)}
                              className="text-error-600 hover:text-error-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Buses Tab */}
        {activeTab === "buses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-buenard font-bold text-platinum-900">
                Bus Management
              </h2>
              <Button
                onClick={() => openCreateDialog("bus")}
                className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Bus
              </Button>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-inknut">
                        Plate Number
                      </TableHead>
                      <TableHead className="font-inknut">Capacity</TableHead>
                      <TableHead className="font-inknut">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buses.map((bus) => (
                      <TableRow key={bus.id}>
                        <TableCell className="font-forum">
                          {bus.plate_number}
                        </TableCell>
                        <TableCell className="font-forum">
                          {bus.capacity} passengers
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit("bus", bus)}
                              className="text-persian-blue-600 hover:text-persian-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete("bus", bus.id)}
                              className="text-error-600 hover:text-error-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === "routes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-buenard font-bold text-platinum-900">
                Route Management
              </h2>
              <Button
                onClick={() => openCreateDialog("route")}
                className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Route
              </Button>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-inknut">Origin</TableHead>
                      <TableHead className="font-inknut">Destination</TableHead>
                      <TableHead className="font-inknut">Duration</TableHead>
                      <TableHead className="font-inknut">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-forum">
                          {route.origin}
                        </TableCell>
                        <TableCell className="font-forum">
                          {route.destination}
                        </TableCell>
                        <TableCell className="font-forum">
                          {route.estimated_duration_minutes} minutes
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit("route", route)}
                              className="text-persian-blue-600 hover:text-persian-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete("route", route.id)}
                              className="text-error-600 hover:text-error-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Driver Dialog */}
      <Dialog open={driverDialogOpen} onOpenChange={setDriverDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-buenard">
              {editingItem ? "Edit Driver" : "Add New Driver"}
            </DialogTitle>
            <DialogDescription className="font-forum">
              {editingItem
                ? "Update driver information"
                : "Enter driver details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                <Input
                  placeholder="Enter driver name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10 font-forum"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                License Number
              </Label>
              <Input
                placeholder="Enter license number"
                value={formData.license_number || ""}
                onChange={(e) =>
                  setFormData({ ...formData, license_number: e.target.value })
                }
                className="font-forum"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Availability
              </Label>
              <Select
                value={formData.available?.toString() || "true"}
                onValueChange={(value) =>
                  setFormData({ ...formData, available: value === "true" })
                }
              >
                <SelectTrigger className="font-forum">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDriverDialogOpen(false)}
              className="font-inknut"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit("drivers")}
              disabled={loading}
              className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bus Dialog */}
      <Dialog open={busDialogOpen} onOpenChange={setBusDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-buenard">
              {editingItem ? "Edit Bus" : "Add New Bus"}
            </DialogTitle>
            <DialogDescription className="font-forum">
              {editingItem ? "Update bus information" : "Enter bus details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Plate Number
              </Label>
              <div className="relative">
                <Bus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                <Input
                  placeholder="Enter plate number"
                  value={formData.plate_number || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, plate_number: e.target.value })
                  }
                  className="pl-10 font-forum"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Capacity
              </Label>
              <Input
                type="number"
                placeholder="Enter passenger capacity"
                value={formData.capacity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value),
                  })
                }
                className="font-forum"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBusDialogOpen(false)}
              className="font-inknut"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit("buses")}
              disabled={loading}
              className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route Dialog */}
      <Dialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-buenard">
              {editingItem ? "Edit Route" : "Add New Route"}
            </DialogTitle>
            <DialogDescription className="font-forum">
              {editingItem ? "Update route information" : "Enter route details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Origin
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                <Input
                  placeholder="Enter origin location"
                  value={formData.origin || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, origin: e.target.value })
                  }
                  className="pl-10 font-forum"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Destination
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                <Input
                  placeholder="Enter destination location"
                  value={formData.destination || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  className="pl-10 font-forum"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Estimated Duration (minutes)
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
                <Input
                  type="number"
                  placeholder="Enter duration in minutes"
                  value={formData.estimated_duration_minutes || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimated_duration_minutes: parseInt(e.target.value),
                    })
                  }
                  className="pl-10 font-forum"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRouteDialogOpen(false)}
              className="font-inknut"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit("routes")}
              disabled={loading}
              className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shift Dialog */}
      <Dialog open={shiftDialogOpen} onOpenChange={setShiftDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-buenard">
              {editingItem ? "Edit Shift" : "Schedule New Shift"}
            </DialogTitle>
            <DialogDescription className="font-forum">
              {editingItem
                ? "Update shift information"
                : "Assign driver to bus and route"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Driver *
              </Label>
              <Select
                value={formData.driver_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, driver_id: parseInt(value) })
                }
              >
                <SelectTrigger className={cn(
                  "font-forum",
                  !formData.driver_id && "border-error-500"
                )}>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers
                    .filter((d) => d.available)
                    .map((driver) => (
                      <SelectItem key={driver.id} value={driver.id.toString()}>
                        {driver.name} ({driver.license_number})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Bus *
              </Label>
              <Select
                value={formData.bus_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, bus_id: parseInt(value) })
                }
              >
                <SelectTrigger className={cn(
                  "font-forum",
                  !formData.bus_id && "border-error-500"
                )}>
                  <SelectValue placeholder="Select bus" />
                </SelectTrigger>
                <SelectContent>
                  {buses.map((bus) => (
                    <SelectItem key={bus.id} value={bus.id.toString()}>
                      {bus.plate_number} (Capacity: {bus.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-platinum-800 font-inknut">
                Route *
              </Label>
              <Select
                value={formData.route_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, route_id: parseInt(value) })
                }
              >
                <SelectTrigger className={cn(
                  "font-forum",
                  !formData.route_id && "border-error-500"
                )}>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id.toString()}>
                      {route.origin} → {route.destination} (
                      {route.estimated_duration_minutes}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-platinum-800 font-inknut">
                  Shift Date *
                </Label>
                <Input
                  type="date"
                  value={formData.shift_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, shift_date: e.target.value })
                  }
                  className={cn(
                    "font-forum",
                    !formData.shift_date && "border-error-500"
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-platinum-800 font-inknut">
                  Shift Time *
                </Label>
                <Input
                  type="time"
                  value={formData.shift_time || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, shift_time: e.target.value })
                  }
                  className={cn(
                    "font-forum",
                    !formData.shift_time && "border-error-500"
                  )}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShiftDialogOpen(false)}
              className="font-inknut"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!formData.driver_id || !formData.bus_id || !formData.route_id || !formData.shift_date || !formData.shift_time) {
                  setError("Please fill in all required fields");
                  return;
                }
                handleSubmit("shifts");
              }}
              disabled={loading}
              className="bg-gradient-to-r from-persian-blue-500 to-dark-cyan-500 hover:from-persian-blue-600 hover:to-dark-cyan-600 text-white font-inknut"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingItem ? "Update" : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
