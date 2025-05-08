import { create } from 'zustand';
import { CompanyFilter, CompanySort, CompanyPagination } from '@/types/company';

interface CompanyUIState {
  filter: CompanyFilter;
  sort: CompanySort;
  pagination: CompanyPagination;
  setFilter: (filter: Partial<CompanyFilter>) => void;
  setSort: (sort: CompanySort) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
}

const useCompanyStore = create<CompanyUIState>((set) => ({
  filter: {},
  sort: { field: 'createdAt', direction: 'desc' },
  pagination: { page: 1, limit: 5, total: 0 },

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1 when filter changes
    })),

  setSort: (sort) => set({ sort }),

  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, page }
    })),

  setLimit: (limit) =>
    set((state) => ({
      pagination: { ...state.pagination, limit, page: 1 } // Reset to page 1 when limit changes
    })),

  resetFilters: () =>
    set({
      filter: {},
      sort: { field: 'createdAt', direction: 'desc' },
      pagination: { page: 1, limit: 5, total: 0 },
    }),
}));

export default useCompanyStore;
