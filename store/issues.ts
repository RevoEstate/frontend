import { create } from "zustand";
import { IssueFilters, IssueStatus, IssueType, IssuePriority } from "@/types/issue";

interface IssuesState {
  filters: IssueFilters;
  setFilters: (filters: Partial<IssueFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: IssueFilters = {
  page: 1,
  limit: 10,
  sortBy: "dateRaised",
  sortOrder: "desc",
};

export const useIssuesStore = create<IssuesState>((set) => ({
  filters: defaultFilters,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
        // Reset to page 1 when filters change (except when page is explicitly set)
        page: newFilters.page ?? 1,
      },
    })),

  resetFilters: () => set({ filters: defaultFilters }),
})); 
