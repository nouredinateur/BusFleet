"use client";

import { useState } from "react";
import { DialogState } from "../types";

export function useDialogState() {
  const [dialogState, setDialogState] = useState<DialogState>({
    driverDialogOpen: false,
    busDialogOpen: false,
    routeDialogOpen: false,
    shiftDialogOpen: false,
  });

  const setDriverDialogOpen = (open: boolean) => {
    setDialogState(prev => ({ ...prev, driverDialogOpen: open }));
  };

  const setBusDialogOpen = (open: boolean) => {
    setDialogState(prev => ({ ...prev, busDialogOpen: open }));
  };

  const setRouteDialogOpen = (open: boolean) => {
    setDialogState(prev => ({ ...prev, routeDialogOpen: open }));
  };

  const setShiftDialogOpen = (open: boolean) => {
    setDialogState(prev => ({ ...prev, shiftDialogOpen: open }));
  };

  return {
    ...dialogState,
    setDriverDialogOpen,
    setBusDialogOpen,
    setRouteDialogOpen,
    setShiftDialogOpen,
  };
}