import React from "react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormData, ValidationErrors, Driver, Bus, Route } from "../types";

interface ShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: any;
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  validationErrors: ValidationErrors;
  dialogError: string;
  loading: boolean;
  drivers: Driver[];
  buses: Bus[];
  routes: Route[];
  onSubmit: () => void;
}

export function ShiftDialog({
  open,
  onOpenChange,
  editingItem,
  formData,
  onFormDataChange,
  validationErrors,
  dialogError,
  loading,
  drivers,
  buses,
  routes,
  onSubmit,
}: ShiftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        {dialogError && (
          <Alert className="border-error-200 bg-error-50">
            <AlertCircle className="h-4 w-4 text-error-600" />
            <AlertDescription className="text-error-700 font-forum">
              {dialogError}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              Driver *
            </Label>
            <Select
              value={formData.driver_id?.toString() || ""}
              onValueChange={(value) =>
                onFormDataChange({ driver_id: parseInt(value) })
              }
            >
              <SelectTrigger
                className={cn(
                  "font-forum",
                  validationErrors.driver_id &&
                    "border-error-500 focus:border-error-500"
                )}
              >
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
            {validationErrors.driver_id && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.driver_id}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              Bus *
            </Label>
            <Select
              value={formData.bus_id?.toString() || ""}
              onValueChange={(value) =>
                onFormDataChange({ bus_id: parseInt(value) })
              }
            >
              <SelectTrigger
                className={cn(
                  "font-forum",
                  validationErrors.bus_id &&
                    "border-error-500 focus:border-error-500"
                )}
              >
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
            {validationErrors.bus_id && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.bus_id}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              Route *
            </Label>
            <Select
              value={formData.route_id?.toString() || ""}
              onValueChange={(value) =>
                onFormDataChange({ route_id: parseInt(value) })
              }
            >
              <SelectTrigger
                className={cn(
                  "font-forum",
                  validationErrors.route_id &&
                    "border-error-500 focus:border-error-500"
                )}
              >
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id.toString()}>
                    {route.origin} → {route.destination} (
                    {route.estimated_duration_minutes} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.route_id && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.route_id}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              Shift Date *
            </Label>
            <Input
              type="date"
              value={formData.shift_date || ""}
              onChange={(e) => onFormDataChange({ shift_date: e.target.value })}
              className={cn(
                "font-forum",
                validationErrors.shift_date &&
                  "border-error-500 focus:border-error-500"
              )}
            />
            {validationErrors.shift_date && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.shift_date}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              Shift Time *
            </Label>
            <Input
              type="time"
              value={formData.shift_time || ""}
              onChange={(e) => onFormDataChange({ shift_time: e.target.value })}
              className={cn(
                "font-forum",
                validationErrors.shift_time &&
                  "border-error-500 focus:border-error-500"
              )}
            />
            {validationErrors.shift_time && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.shift_time}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-inknut"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="bg-black text-white font-inknut"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {editingItem ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
