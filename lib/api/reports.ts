import { CreateReportDto, Report, ReportFilters, UpdateReportDto } from "@/types/report";
import axiosInstance from "../axiosInstance";

const REPORTS_API = "/v1/reports";

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ReportsData {
  reports: Report[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export const reportsApi = {
  getAll: async (filters?: ReportFilters) => {
    const { data } = await axiosInstance.get<ApiResponse<ReportsData>>(REPORTS_API, { params: filters });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Report>(`${REPORTS_API}/${id}`);
    return data;
  },

  create: async (createReportDto: CreateReportDto) => {
    const { data } = await axiosInstance.post<Report>(REPORTS_API, createReportDto);
    return data;
  },

  update: async (id: string, updateReportDto: UpdateReportDto) => {
    const { data } = await axiosInstance.patch<Report>(`${REPORTS_API}/${id}`, updateReportDto);
    return data;
  },

  dismiss: async (id: string, notes?: string) => {
    const { data } = await axiosInstance.patch<Report>(`${REPORTS_API}/${id}/dismiss`, { notes });
    return data;
  },

  resolve: async (id: string, notes?: string) => {
    const { data } = await axiosInstance.patch<Report>(`${REPORTS_API}/${id}/resolve`, { notes });
    return data;
  },

  removeContent: async (id: string) => {
    const { data } = await axiosInstance.delete<void>(`${REPORTS_API}/${id}/content`);
    return data;
  }
}; 
