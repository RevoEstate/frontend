import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"
import type { Package } from "@/types/package"

// Fetch a single package by ID
export function usePackage(id: string) {
  const packageQuery = useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/system-admin/getpackage/${id}`)
      return response.data.data as Package
    },
    enabled: !!id, // Only run if ID is provided
  })

  return {
    package: packageQuery.data,
    isLoading: packageQuery.isLoading,
    error: packageQuery.error?.message || null,
  }
}
