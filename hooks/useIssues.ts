import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { issuesApi } from "@/lib/api/issues";
import { CreateIssueDTO, RespondToIssueDTO, ResolveIssueDTO, IssuesResponse, IssueResponse } from "@/types/issue";
import { useIssuesStore } from "@/store/issues";
import { toast } from "sonner";

export const useIssues = () => {
  const filters = useIssuesStore((state) => state.filters);

  return useQuery<IssuesResponse, Error>({
    queryKey: ["issues", filters],
    queryFn: () => issuesApi.getIssues(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useIssue = (issueId: string) => {
  return useQuery<IssueResponse, Error>({
    queryKey: ["issue", issueId],
    queryFn: () => issuesApi.getIssueById(issueId),
    enabled: !!issueId,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation<IssueResponse, Error, CreateIssueDTO>({
    mutationFn: (data) => issuesApi.createIssue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast.success("Issue created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create issue");
    },
  });
};

export const useRespondToIssue = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IssueResponse,
    Error,
    { issueId: string; data: RespondToIssueDTO }
  >({
    mutationFn: ({ issueId, data }) => issuesApi.respondToIssue(issueId, data),
    onSuccess: (_, { issueId }) => {
      queryClient.invalidateQueries({ queryKey: ["issue", issueId] });
      toast.success("Response added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add response");
    },
  });
};

export const useResolveIssue = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IssueResponse,
    Error,
    { issueId: string; data: ResolveIssueDTO }
  >({
    mutationFn: ({ issueId, data }) => issuesApi.resolveIssue(issueId, data),
    onSuccess: (_, { issueId }) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", issueId] });
      toast.success("Issue resolved successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resolve issue");
    },
  });
}; 
