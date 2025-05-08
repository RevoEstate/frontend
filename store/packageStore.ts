import { create } from "zustand"
import type { PackageFilter, PackageSort, PackagePagination } from "@/types/package"

interface PackageUIState {
  filter: PackageFilter
  sort: PackageSort
  pagination: PackagePagination
  setFilter: (filter: Partial<PackageFilter>) => void
  setSort: (sort: PackageSort) => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  resetFilters: () => void
}

const usePackageStore = create<PackageUIState>((set) => ({
  filter: {},
  sort: { field: "createdAt", direction: "desc" },
  pagination: { page: 1, limit: 10, total: 0 },

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page when filter changes
    })),

  setSort: (sort) => set({ sort }),

  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, page },
    })),

  setLimit: (limit) =>
    set((state) => ({
      pagination: { ...state.pagination, limit, page: 1 }, // Reset to first page when limit changes
    })),

  resetFilters: () =>
    set({
      filter: {},
      sort: { field: "createdAt", direction: "desc" },
      pagination: { page: 1, limit: 10, total: 0 },
    }),
}))

export default usePackageStore
