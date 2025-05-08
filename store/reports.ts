import { Report, ReportFilters } from "@/types/report";
import { create } from "zustand";

interface ReportsState {
  filters: ReportFilters;
  selectedReport: Report | null;
  setFilters: (filters: ReportFilters) => void;
  setSelectedReport: (report: Report | null) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  filters: {},
  selectedReport: null,
  setFilters: (filters) => set({ filters }),
  setSelectedReport: (report) => set({ selectedReport: report }),
})); 
