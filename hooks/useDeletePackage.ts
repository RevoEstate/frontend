import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"

// Delete package hook
export function useDeletePackage() {
  const queryClient = useQueryClient()

  const deletePackageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/v1/system-admin/deletepackage/${id}`)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch packages list
      queryClient.invalidateQueries({ queryKey: ["packages"] })
    },
  })

  return {
    deletePackage: deletePackageMutation.mutate,
    isDeleting: deletePackageMutation.isPending,
    error: deletePackageMutation.error?.message || null,
    isSuccess: deletePackageMutation.isSuccess,
  }
}
