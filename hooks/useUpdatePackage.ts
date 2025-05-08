import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"
import type { Package } from "@/types/package"

// Type for update package data
export type UpdatePackageData = Omit<Package, "_id" | "userId" | "createdAt" | "updatedAt">

// Update package hook
export function useUpdatePackage() {
  const queryClient = useQueryClient()

  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePackageData }) => {
      const response = await axiosInstance.put(`/v1/system-admin/updatepackage/${id}`, data)
      return response.data.data
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["packages"] })
      queryClient.invalidateQueries({ queryKey: ["package", variables.id] })
    },
  })

  return {
    updatePackage: updatePackageMutation.mutate,
    isUpdating: updatePackageMutation.isPending,
    error: updatePackageMutation.error?.message || null,
    isSuccess: updatePackageMutation.isSuccess,
  }
}
