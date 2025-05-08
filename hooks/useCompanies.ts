import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { Company, CompanyFilter, CompanySort, CompanyPagination } from '@/types/company';
import useCompanyStore from '@/stores/companyStore';

// Fetch companies with pagination
const fetchCompanies = async (
  filter: CompanyFilter,
  sort: CompanySort,
  pagination: Omit<CompanyPagination, 'total'>
): Promise<{ items: Company[]; total: number; page: number; limit: number }> => {
  const params = new URLSearchParams();

  // Add pagination parameters
  params.append('page', pagination.page.toString());
  params.append('limit', pagination.limit.toString());

  // Add sorting parameters
  if (sort.field) {
    params.append('sortBy', sort.field);
    params.append('sortDirection', sort.direction);
  }

  // Add filter parameters
  if (filter.search) params.append('search', filter.search);
  if (filter.companyStatus) params.append('companyStatus', filter.companyStatus);
  if (filter.verificationStatus) params.append('verificationStatus', filter.verificationStatus);
  if (filter.location) params.append('location', filter.location);

  const response = await axiosInstance.get(`/v1/companies/getAllCompany?${params.toString()}`);

  // Return properly structured data from API response
  return {
    items: response.data.data.data || [],
    total: response.data.data.total || 0,
    page: response.data.data.page || pagination.page,
    limit: response.data.data.limit || pagination.limit
  };
};

// Suspend company
const suspendCompany = async ({
  companyId,
  reason,
}: {
  companyId: string;
  reason: string;
}): Promise<void> => {
  await axiosInstance.patch(`/v1/companies/suspend/${companyId}`, { reason });
};

// activate company
const activateCompany = async ({  
  companyId,
}: {
    companyId: string;
}): Promise<void> => {
  await axiosInstance.patch(`/v1/companies/activate/${companyId}`);
};

// Deactivate company
const deactivateCompany = async (companyId: string): Promise<void> => {
  await axiosInstance.delete(`/v1/companies/${companyId}`);
};

// Approve company
const approveCompany = async (companyId: string): Promise<void> => {
  await axiosInstance.patch(`/v1/companies/approve/${companyId}`);
};

// Reject company
const rejectCompany = async ({
  companyId,
  rejectionreason,
}: {
  companyId: string;
  rejectionreason: string;
}): Promise<void> => {
  await axiosInstance.patch(`/v1/companies/reject/${companyId}`, { rejectionreason });
};

// Custom hook
export function useCompanies(
  filterParam?: CompanyFilter,
  sortParam?: CompanySort,
  paginationParam?: Omit<CompanyPagination, 'total'>
) {
  const queryClient = useQueryClient();
  const store = useCompanyStore();

  // Use provided params or fall back to store values
  const filter = filterParam || store.filter;
  const sort = sortParam || store.sort;
  const pagination = paginationParam || store.pagination;

  const companiesQuery = useQuery({
    queryKey: ['companies', filter, sort, pagination],
    queryFn: () => fetchCompanies(filter, sort, pagination),
    staleTime: 5000, // Keep data fresh for 5 seconds
  });

  const suspendMutation = useMutation({
    mutationFn: suspendCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: activateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: approveCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies'],
      });
    },
  });

  return {
    companies: companiesQuery.data?.items || [],
    total: companiesQuery.data?.total || 0,
    page: companiesQuery.data?.page || pagination.page,
    limit: companiesQuery.data?.limit || pagination.limit,
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error,
    suspendCompany: suspendMutation.mutate,
    isSuspending: suspendMutation.isPending,
    suspendError: suspendMutation.error,
    activateCompany: activateMutation.mutate,
    isActivating: activateMutation.isPending,
    activateError: activateMutation.error,
    deactivateCompany: deactivateMutation.mutate,
    isDeactivating: deactivateMutation.isPending,
    deactivateError: deactivateMutation.error,
    approveCompany: approveMutation.mutate,
    isApproving: approveMutation.isPending,
    approveError: approveMutation.error,
    rejectCompany: rejectMutation.mutate,
    isRejecting: rejectMutation.isPending,
    rejectError: rejectMutation.error,
  };
}
