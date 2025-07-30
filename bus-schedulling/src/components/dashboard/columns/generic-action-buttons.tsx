"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { UserPermissions } from "@/lib/permissions";

interface BaseEntity {
  id: number;
}

interface GenericActionButtonsProps<T extends BaseEntity> {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  permissions: UserPermissions;
  deleteConfirmation?: {
    title: string;
    getDescription: (item: T) => string;
    confirmText?: string;
    cancelText?: string;
  };
  className?: string;
}

export function GenericActionButtons<T extends BaseEntity>({
  item,
  onEdit,
  onDelete,
  permissions,
  deleteConfirmation,
  className = "",
}: GenericActionButtonsProps<T>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (deleteConfirmation) {
      setDeleteDialogOpen(true);
    } else {
      onDelete(item.id);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(item.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className={`flex space-x-2 ${className}`}>
        {permissions.canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="text-persian-blue-600 hover:text-persian-blue-700"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        {permissions.canDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-error-600 hover:text-error-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {deleteConfirmation && (
        <ConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={deleteConfirmation.title}
          description={deleteConfirmation.getDescription(item)}
          confirmText={deleteConfirmation.confirmText || "Delete"}
          cancelText={deleteConfirmation.cancelText || "Cancel"}
          variant="destructive"
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}