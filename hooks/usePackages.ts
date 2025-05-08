import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"
import type { Package, PackageFilter, PackageSort, PackagePagination } from "@/types/package"

// Fetch packages
const fetchPackages = async (
  filter: PackageFilter,
  sort: PackageSort,
  pagination: PackagePagination,
): Promise<{ items: Package[]; total: number }> => {
  const params = new URLSearchParams()

  // Pagination params
  params.append("page", pagination.page.toString())
  params.append("limit", pagination.limit.toString())

  // Sorting params
  params.append("sortBy", sort.field)
  params.append("sortOrder", sort.direction)

  // Filter params
  if (filter.search) params.append("search", filter.search)
  if (filter.packageType) params.append("packageType", filter.packageType)
  if (filter.minPrice) params.append("minPrice", filter.minPrice.toString())
  if (filter.maxPrice) params.append("maxPrice", filter.maxPrice.toString())
  if (filter.minDuration) params.append("minDuration", filter.minDuration.toString())
  if (filter.maxDuration) params.append("maxDuration", filter.maxDuration.toString())
  if (filter.minProperties) params.append("minProperties", filter.minProperties.toString())
  if (filter.maxProperties) params.append("maxProperties", filter.maxProperties.toString())

  const response = await axiosInstance.get(`/v1/system-admin/getallpackages?${params.toString()}`)
  console.log("Package API Response:", response.data) // Debugging line

  return {
    items: response.data.data.packages,
    total: response.data.data.total, // Adjust based on actual API pagination
  }
}

// Custom hook
export function usePackages(filter: PackageFilter, sort: PackageSort, pagination: PackagePagination) {
  const packagesQuery = useQuery({
    queryKey: ["packages", filter, sort, pagination],
    queryFn: () => fetchPackages(filter, sort, pagination),
    staleTime: 5000, // Smooth pagination by keeping data fresh for 5 seconds
  })

  return {
    packages: packagesQuery.data?.items || [],
    total: packagesQuery.data?.total || 0,
    isLoading: packagesQuery.isLoading,
    error: packagesQuery.error?.message || null,
  };
}
