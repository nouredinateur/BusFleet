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
import { AlertCircle, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormData, ValidationErrors } from "../types";

interface DriverDialogProps {
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

export function DriverDialog({
  open,
  onOpenChange,
  editingItem,
  formData,
  onFormDataChange,
  validationErrors,
  dialogError,
  loading,
  onSubmit,
}: DriverDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-platinum-600" />
              <Input
                placeholder="Enter driver name"
                value={formData.name || ""}
                onChange={(e) =>
                  onFormDataChange({ name: e.target.value })
                }
                className={cn(
                  "pl-10 font-forum",
                  validationErrors.name && "border-error-500 focus:border-error-500"
                )}
              />
            </div>
            {validationErrors.name && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              License Number *
            </Label>
            <Input
              placeholder="Enter license number"
              value={formData.license_number || ""}
              onChange={(e) =>
                onFormDataChange({ license_number: e.target.value })
              }
              className={cn(
                "font-forum",
                validationErrors.license_number && "border-error-500 focus:border-error-500"
              )}
            />
            {validationErrors.license_number && (
              <p className="text-sm text-error-600 font-forum">
                {validationErrors.license_number}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-platinum-800 font-inknut">
              Availability
            </Label>
            <Select
              value={formData.available?.toString() || "true"}
              onValueChange={(value) =>
                onFormDataChange({ available: value === "true" })
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