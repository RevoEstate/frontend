import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { CreatePolicyDTO, Policy, PolicyFilters, UpdatePolicyDTO } from "@/types/policy";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Query keysmp
const POLICIES_KEY = "policies";
const POLICY_DETAIL_KEY = "policy";

// API endpoints
const API_URL = "/v1/policies";

export const usePolicies = (filters: PolicyFilters = {}) => {
  return useQuery({
    queryKey: [POLICIES_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const { data } = await axiosInstance.get(`${API_URL}?${params}`);
      console.log("data", data)
      return data.data;
    },
  });
};

export const usePolicy = (policyId: string) => {
  return useQuery({
    queryKey: [POLICY_DETAIL_KEY, policyId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/${policyId}`);
      return data as Policy;
    },
    enabled: !!policyId,  
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newPolicy: CreatePolicyDTO) => {
      const { data } = await axiosInstance.post(API_URL, newPolicy);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POLICIES_KEY] });
      toast({
        title: "Policy created",
        description: "The policy has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating policy",
        description: error.response?.data?.message || "An error occurred while creating the policy",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePolicy = (policyId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: UpdatePolicyDTO) => {
      const { data } = await axiosInstance.patch(`${API_URL}/${policyId}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POLICIES_KEY] });
      queryClient.invalidateQueries({ queryKey: [POLICY_DETAIL_KEY, policyId] });
      toast({
        title: "Policy updated",
        description: "The policy has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating policy",
        description: error.response?.data?.message || "An error occurred while updating the policy",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (policyId: string) => {
      const { data } = await axiosInstance.delete(`${API_URL}/${policyId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POLICIES_KEY] });
      toast({
        title: "Policy deleted",
        description: "The policy has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting policy",
        description: error.response?.data?.message || "An error occurred while deleting the policy",
        variant: "destructive",
      });
    },
  });
};

export const useArchivePolicy = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (policyId: string) => {
      const { data } = await axiosInstance.patch(`${API_URL}/${policyId}/archive`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POLICIES_KEY] });
      toast({
        title: "Policy archived",
        description: "The policy has been archived successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error archiving policy",
        description: error.response?.data?.message || "An error occurred while archiving the policy",
        variant: "destructive",
      });
    },
  });
}; 
