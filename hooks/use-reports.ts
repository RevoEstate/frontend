import { CreateReportDto, Report, UpdateReportDto } from "@/types/report";
import { reportsApi, ApiResponse, ReportsData } from "@/lib/api/reports";
import { useReportsStore } from "@/store/reports";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const REPORTS_QUERY_KEY = "reports";

export function useReports() {
  const queryClient = useQueryClient();
  const { filters } = useReportsStore();

  const {
    data: reports,
    isLoading,
    error,
  } = useQuery<ApiResponse<ReportsData>>({
    queryKey: [REPORTS_QUERY_KEY, filters],
    queryFn: () => reportsApi.getAll(filters),
  });

  const { mutate: createReport } = useMutation({
    mutationFn: (data: CreateReportDto) => reportsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
      toast.success("Report created successfully");
    },
    onError: () => {
      toast.error("Failed to create report");
    },
  });

  const { mutate: updateReport } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReportDto }) =>
      reportsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
      toast.success("Report updated successfully");
    },
    onError: () => {
      toast.error("Failed to update report");
    },
  });

  const { mutate: dismissReport } = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      reportsApi.dismiss(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
      toast.success("Report dismissed successfully");
    },
    onError: () => {
      toast.error("Failed to dismiss report");
    },
  });

  const { mutate: resolveReport } = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      reportsApi.resolve(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
      toast.success("Report resolved successfully");
    },
    onError: () => {
      toast.error("Failed to resolve report");
    },
  });

  const { mutate: removeContent } = useMutation({
    mutationFn: (id: string) => reportsApi.removeContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
      toast.success("Content removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove content");
    },
  });

  return {
    reports,
    isLoading,
    error,
    createReport,
    updateReport,
    dismissReport,
    resolveReport,
    removeContent,
  };
} 
