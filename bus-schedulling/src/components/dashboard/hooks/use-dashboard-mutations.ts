import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormData } from "../types";

interface DeleteMutationParams {
  type: string;
  id: number;
}

interface CreateMutationParams {
  type: string;
  data: FormData;
}

interface UpdateMutationParams {
  type: string;
  data: FormData & { id: number };
}

export function useDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, id }: DeleteMutationParams) => {
      const response = await fetch(`/api/${type}?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete failed");
      }

      return response.json();
    },
    onSuccess: (_, { type }) => {
      // Invalidate and refetch the appropriate query
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
}

export function useCreateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, data }: CreateMutationParams) => {
      const response = await fetch(`/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Create failed");
      }

      return response.json();
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
}

export function useUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, data }: UpdateMutationParams) => {
      const response = await fetch(`/api/${type}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Update failed");
      }

      return response.json();
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
}