import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

// Types
export interface Staff {
  _id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "manager" | "support";
  status: "active" | "inactive";
  lastLogin: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    staff: Staff[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export interface SingleStaffResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Staff;
}

export interface StaffFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateStaffDTO {
  name?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  status?: "active" | "inactive";
}

// Zustand store for staff filters and pagination
interface StaffStoreState {
  filters: StaffFilters;
  setFilters: (filters: Partial<StaffFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: StaffFilters = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const useStaffStore = create<StaffStoreState>((set) => ({
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

// API functions
const fetchStaff = async (filters: StaffFilters): Promise<StaffResponse> => {
  const queryParams = new URLSearchParams();

  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.role) queryParams.append("role", filters.role);
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const response = await axiosInstance.get(`/v1/system-admin/staff?${queryParams}`);
  return response.data;
};

const fetchStaffById = async (staffId: string): Promise<SingleStaffResponse> => {
  const response = await axiosInstance.get(`/v1/system-admin/staff/${staffId}`);
  return response.data;
};

const updateStaff = async (staffId: string, data: UpdateStaffDTO): Promise<SingleStaffResponse> => {
  const response = await axiosInstance.put(`/v1/system-admin/staff/${staffId}`, data);
  return response.data;
};

const deleteStaff = async (staffId: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`/v1/system-admin/staff/${staffId}`);
  return response.data;
};

// React Query hooks
export const useStaff = () => {
  const filters = useStaffStore((state) => state.filters);

  return useQuery({
    queryKey: ["staff", filters],
    queryFn: () => fetchStaff(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useStaffById = (staffId: string) => {
  return useQuery({
    queryKey: ["staff", staffId],
    queryFn: () => fetchStaffById(staffId),
    enabled: !!staffId,
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: string; data: UpdateStaffDTO }) =>
      updateStaff(staffId, data),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (staffId: string) => deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });

  return {
    deleteStaff: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  };
};

// Utility functions
export const useDeactivateStaff = () => {
  const updateStaffMutation = useUpdateStaff();

  return {
    deactivateStaff: (staffId: string) =>
      updateStaffMutation.mutate({
        staffId,
        data: { status: "inactive" }
      }),
    isDeactivating: updateStaffMutation.isPending,
    isError: updateStaffMutation.isError,
    error: updateStaffMutation.error
  };
};

export const useActivateStaff = () => {
  const updateStaffMutation = useUpdateStaff();

  return {
    activateStaff: (staffId: string) =>
      updateStaffMutation.mutate({
        staffId,
        data: { status: "active" }
      }),
    isActivating: updateStaffMutation.isPending,
  };
}; 
