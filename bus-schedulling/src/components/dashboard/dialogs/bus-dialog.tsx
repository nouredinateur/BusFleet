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
import { AlertCircle, Loader2, Bus as BusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormData, ValidationErrors, Bus } from "../types";

interface BusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: Bus | null;
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  validationErrors: ValidationErrors;
  dialogError: string;
  loading: boolean;
  onSubmit: () => void;
}

export function BusDialog({
  open,
  onOpenChange,
  editingItem,
  formData,
  onFormDataChange,
  validationErrors,
  dialogError,
  loading,
  onSubmit,
}: BusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="font-buenard">
            {editingItem ? "Edit Bus" : "Add New Bus"}
          </DialogTitle>
          <DialogDescription className="font-forum">
            {editingItem ? "Update bus information" : "Enter bus details"}
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
              Plate Number *
            </Label>
            <div className="relative">
              <BusIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
              <Input
                placeholder="Enter plate number"
                value={formData.plate_number || ""}
                onChange={(e) =>
                  onFormDataChange({ plate_number: e.target.value })
                }
                className={cn(
                  "pl-10 font-forum",
                  validationErrors.plate_number &&
                    "border-error-500 focus:border-error-500"
                )}
              />
            </div>
            {validationErrors.plate_number && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.plate_number}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              Capacity *
            </Label>
            <Input
              type="number"
              placeholder="Enter passenger capacity"
              value={formData.capacity || ""}
              onChange={(e) =>
                onFormDataChange({
                  capacity: parseInt(e.target.value) || 0,
                })
              }
              className={cn(
                "font-forum",
                validationErrors.capacity &&
                  "border-error-500 focus:border-error-500"
              )}
            />
            {validationErrors.capacity && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.capacity}
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
