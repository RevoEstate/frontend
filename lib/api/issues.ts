import axiosInstance from "@/lib/axiosInstance";
import { CreateIssueDTO, IssueFilters, IssueResponse, IssuesResponse, RespondToIssueDTO, ResolveIssueDTO } from "@/types/issue";

export const issuesApi = {
  getIssues: async (filters: IssueFilters) => {
    const queryParams = new URLSearchParams();

    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.type) queryParams.append("type", filters.type);
    if (filters.priority) queryParams.append("priority", filters.priority);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

    const response = await axiosInstance.get<IssuesResponse>(`/v1/issues?${queryParams}`);
    return response.data;
  },

  getIssueById: async (issueId: string) => {
    const response = await axiosInstance.get<IssueResponse>(`/v1/issues/${issueId}`);
    return response.data;
  },

  createIssue: async (data: CreateIssueDTO) => {
    const formData = new FormData();
    formData.append("summary", data.summary);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("priority", data.priority);

    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await axiosInstance.post<IssueResponse>("/v1/issues/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  respondToIssue: async (issueId: string, data: RespondToIssueDTO) => {
    const formData = new FormData();
    formData.append("message", data.message);

    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await axiosInstance.post<IssueResponse>(
      `/v1/issues/${issueId}/respond`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  resolveIssue: async (issueId: string, data: ResolveIssueDTO) => {
    const response = await axiosInstance.patch<IssueResponse>(
      `/v1/issues/${issueId}/resolve`,
      data
    );
    return response.data;
  },
}; 
