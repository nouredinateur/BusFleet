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
import { AlertCircle, Loader2, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormData, ValidationErrors } from "../types";

interface RouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: any;
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  validationErrors: ValidationErrors;
  dialogError: string;
  loading: boolean;
  onSubmit: () => void;
}

export function RouteDialog({
  open,
  onOpenChange,
  editingItem,
  formData,
  onFormDataChange,
  validationErrors,
  dialogError,
  loading,
  onSubmit,
}: RouteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="font-buenard">
            {editingItem ? "Edit Route" : "Add New Route"}
          </DialogTitle>
          <DialogDescription className="font-forum">
            {editingItem ? "Update route information" : "Enter route details"}
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
              Origin *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
              <Input
                placeholder="Enter origin location"
                value={formData.origin || ""}
                onChange={(e) =>
                  onFormDataChange({ origin: e.target.value })
                }
                className={cn(
                  "pl-10 font-forum",
                  validationErrors.origin && "border-error-500 focus:border-error-500"
                )}
              />
            </div>
            {validationErrors.origin && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.origin}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              Destination *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
              <Input
                placeholder="Enter destination location"
                value={formData.destination || ""}
                onChange={(e) =>
                  onFormDataChange({ destination: e.target.value })
                }
                className={cn(
                  "pl-10 font-forum",
                  validationErrors.destination && "border-error-500 focus:border-error-500"
                )}
              />
            </div>
            {validationErrors.destination && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.destination}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              Estimated Duration (minutes) *
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
              <Input
                type="number"
                placeholder="Enter duration in minutes"
                value={formData.estimated_duration_minutes || ""}
                onChange={(e) =>
                  onFormDataChange({
                    estimated_duration_minutes: parseInt(e.target.value) || 0,
                  })
                }
                className={cn(
                  "pl-10 font-forum",
                  validationErrors.estimated_duration_minutes && "border-error-500 focus:border-error-500"
                )}
              />
            </div>
            {validationErrors.estimated_duration_minutes && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.estimated_duration_minutes}
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
  );
}