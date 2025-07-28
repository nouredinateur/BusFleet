import { renderHook, act } from '@testing-library/react';
import { useDashboardData } from '../use-dashboard-data';
import { useDialogState } from '../use-dialog-state';
import { useFormState } from '../use-form-state';

// Mock fetch globally
global.fetch = jest.fn();

describe('Dashboard Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    });
  });

  describe('useDashboardData', () => {
    it('initializes with empty state and loads data', async () => {
      const { result } = renderHook(() => useDashboardData());
      
      // Initially should have empty arrays
      expect(result.current.drivers).toEqual([]);
      expect(result.current.buses).toEqual([]);
      expect(result.current.routes).toEqual([]);
      expect(result.current.shifts).toEqual([]);
      expect(result.current.error).toBe('');
      expect(result.current.success).toBe('');
      
      // Wait for the useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      // After useEffect, loading should be false
      expect(result.current.loading).toBe(false);
    });

    it('provides setter functions', () => {
      const { result } = renderHook(() => useDashboardData());
      
      expect(typeof result.current.setDrivers).toBe('function');
      expect(typeof result.current.setBuses).toBe('function');
      expect(typeof result.current.setRoutes).toBe('function');
      expect(typeof result.current.setShifts).toBe('function');
      expect(typeof result.current.setError).toBe('function');
      expect(typeof result.current.setSuccess).toBe('function');
      expect(typeof result.current.loadAllData).toBe('function');
    });

    it('updates drivers state correctly', async () => {
      const { result } = renderHook(() => useDashboardData());
      
      // Wait for initial useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      const newDrivers = [
        { id: 1, name: 'John Doe', license_number: 'DL123', available: true }
      ];
      
      act(() => {
        result.current.setDrivers(newDrivers);
      });
      
      expect(result.current.drivers).toEqual(newDrivers);
    });

    it('updates buses state correctly', async () => {
      const { result } = renderHook(() => useDashboardData());
      
      // Wait for initial useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      const newBuses = [
        { id: 1, plate_number: 'ABC123', capacity: 50 }
      ];
      
      act(() => {
        result.current.setBuses(newBuses);
      });
      
      expect(result.current.buses).toEqual(newBuses);
    });

    it('updates routes state correctly', async () => {
      const { result } = renderHook(() => useDashboardData());
      
      // Wait for initial useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      const newRoutes = [
        { id: 1, origin: 'Downtown', destination: 'Airport', estimated_duration_minutes: 45 }
      ];
      
      act(() => {
        result.current.setRoutes(newRoutes);
      });
      
      expect(result.current.routes).toEqual(newRoutes);
    });

    it('updates shifts state correctly', async () => {
      const { result } = renderHook(() => useDashboardData());
      
      // Wait for initial useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      const newShifts = [
        { id: 1, driver_id: 1, bus_id: 1, route_id: 1, shift_date: '2024-01-15', shift_time: '08:00' }
      ];
      
      act(() => {
        result.current.setShifts(newShifts);
      });
      
      expect(result.current.shifts).toEqual(newShifts);
    });

    it('updates error state correctly', async () => {
      const { result } = renderHook(() => useDashboardData());
      
      // Wait for initial useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      act(() => {
        result.current.setError('Test error message');
      });
      
      expect(result.current.error).toBe('Test error message');
    });

    it('updates success state correctly', async () => {
      const { result } = renderHook(() => useDashboardData());
      
      // Wait for initial useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      act(() => {
        result.current.setSuccess('Operation successful');
      });
      
      expect(result.current.success).toBe('Operation successful');
    });

    it('handles loading state during data fetch', async () => {
      // Mock a delayed response
      let resolvePromise: (value: any) => void;
      const fetchPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      (global.fetch as jest.Mock).mockReturnValue(fetchPromise);

      const { result } = renderHook(() => useDashboardData());
      
      // Initially loading should be false
      expect(result.current.loading).toBe(false);
      
      // Wait a tick for useEffect to start
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      // Now should be loading
      expect(result.current.loading).toBe(true);
      
      // Resolve the fetch
      await act(async () => {
        resolvePromise!({
          ok: true,
          json: () => Promise.resolve([])
        });
        await fetchPromise;
      });
      
      // Should finish loading
      expect(result.current.loading).toBe(false);
    });

    it('handles fetch errors correctly', async () => {
      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useDashboardData());
      
      // Wait for useEffect and error handling
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(result.current.error).toBe('Failed to load data');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useDialogState', () => {
    it('initializes with all dialogs closed', () => {
      const { result } = renderHook(() => useDialogState());
      
      expect(result.current.driverDialogOpen).toBe(false);
      expect(result.current.busDialogOpen).toBe(false);
      expect(result.current.routeDialogOpen).toBe(false);
      expect(result.current.shiftDialogOpen).toBe(false);
    });

    it('provides setter functions for all dialogs', () => {
      const { result } = renderHook(() => useDialogState());
      
      expect(typeof result.current.setDriverDialogOpen).toBe('function');
      expect(typeof result.current.setBusDialogOpen).toBe('function');
      expect(typeof result.current.setRouteDialogOpen).toBe('function');
      expect(typeof result.current.setShiftDialogOpen).toBe('function');
    });

    it('updates driver dialog state correctly', () => {
      const { result } = renderHook(() => useDialogState());
      
      act(() => {
        result.current.setDriverDialogOpen(true);
      });
      
      expect(result.current.driverDialogOpen).toBe(true);
      expect(result.current.busDialogOpen).toBe(false);
    });

    it('can open multiple dialogs independently', () => {
      const { result } = renderHook(() => useDialogState());
      
      act(() => {
        result.current.setDriverDialogOpen(true);
        result.current.setBusDialogOpen(true);
      });
      
      expect(result.current.driverDialogOpen).toBe(true);
      expect(result.current.busDialogOpen).toBe(true);
      expect(result.current.routeDialogOpen).toBe(false);
      expect(result.current.shiftDialogOpen).toBe(false);
    });

    it('can close dialogs', () => {
      const { result } = renderHook(() => useDialogState());
      
      // Open dialog
      act(() => {
        result.current.setDriverDialogOpen(true);
      });
      
      expect(result.current.driverDialogOpen).toBe(true);
      
      // Close dialog
      act(() => {
        result.current.setDriverDialogOpen(false);
      });
      
      expect(result.current.driverDialogOpen).toBe(false);
    });
  });

  describe('useFormState', () => {
    it('initializes with empty state', () => {
      const { result } = renderHook(() => useFormState());
      
      expect(result.current.editingItem).toBe(null);
      expect(result.current.formData).toEqual({});
      expect(result.current.validationErrors).toEqual({});
      expect(result.current.dialogError).toBe('');
    });

    it('provides all necessary functions', () => {
      const { result } = renderHook(() => useFormState());
      
      expect(typeof result.current.setEditingItem).toBe('function');
      expect(typeof result.current.setFormData).toBe('function');
      expect(typeof result.current.updateFormData).toBe('function');
      expect(typeof result.current.setValidationErrors).toBe('function');
      expect(typeof result.current.setDialogError).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
    });

    it('updates editing item correctly', () => {
      const { result } = renderHook(() => useFormState());
      
      const item = { id: 1, name: 'Test Item' };
      
      act(() => {
        result.current.setEditingItem(item);
      });
      
      expect(result.current.editingItem).toEqual(item);
    });

    it('updates form data correctly', () => {
      const { result } = renderHook(() => useFormState());
      
      const formData = { name: 'John Doe', license_number: 'DL123' };
      
      act(() => {
        result.current.setFormData(formData);
      });
      
      expect(result.current.formData).toEqual(formData);
    });

    it('updates form data partially', () => {
      const { result } = renderHook(() => useFormState());
      
      // Set initial data
      act(() => {
        result.current.setFormData({ name: 'John', license_number: 'DL123' });
      });
      
      // Update partially
      act(() => {
        result.current.updateFormData({ name: 'Jane' });
      });
      
      expect(result.current.formData).toEqual({
        name: 'Jane',
        license_number: 'DL123'
      });
    });

    it('updates validation errors correctly', () => {
      const { result } = renderHook(() => useFormState());
      
      const errors = { name: 'Name is required' };
      
      act(() => {
        result.current.setValidationErrors(errors);
      });
      
      expect(result.current.validationErrors).toEqual(errors);
    });

    it('updates dialog error correctly', () => {
      const { result } = renderHook(() => useFormState());
      
      act(() => {
        result.current.setDialogError('Submission failed');
      });
      
      expect(result.current.dialogError).toBe('Submission failed');
    });

    it('does not automatically clear validation errors when form data changes', () => {
      const { result } = renderHook(() => useFormState());
      
      // Set validation errors
      act(() => {
        result.current.setValidationErrors({ name: 'Required' });
      });
      
      expect(result.current.validationErrors).toEqual({ name: 'Required' });
      
      // Update form data - errors should remain (they're cleared manually in the actual implementation)
      act(() => {
        result.current.updateFormData({ name: 'John' });
      });
      
      // Errors should still be there since the hook doesn't automatically clear them
      expect(result.current.validationErrors).toEqual({ name: 'Required' });
    });
  });

  describe('Hook Integration', () => {
    it('hooks work together correctly', async () => {
      const { result: dashboardResult } = renderHook(() => useDashboardData());
      const { result: dialogResult } = renderHook(() => useDialogState());
      const { result: formResult } = renderHook(() => useFormState());
      
      // Wait for dashboard hook useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      // Simulate opening a dialog and setting form data
      act(() => {
        dialogResult.current.setDriverDialogOpen(true);
        formResult.current.setFormData({ name: 'John Doe' });
        dashboardResult.current.setSuccess('Driver created successfully');
      });
      
      expect(dialogResult.current.driverDialogOpen).toBe(true);
      expect(formResult.current.formData.name).toBe('John Doe');
      expect(dashboardResult.current.success).toBe('Driver created successfully');
    });
  });
});