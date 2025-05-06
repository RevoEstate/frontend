import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { Company, CompanyFilter, CompanySort, CompanyPagination } from '@/types/company';

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
  params.append('sortBy', sort.field);
  params.append('sortDirection', sort.direction);

  // Add filter parameters
  if (filter.search) params.append('search', filter.search);
  if (filter.verificationStatus) params.append('verificationStatus', filter.verificationStatus);
  if (filter.region) params.append('region', filter.region);

  const response = await axiosInstance.get(`/v1/companies/getAllcompany?${params.toString()}`);
  console.log('Company API Response:', response.data);

  // Return properly structured data from API response
  return {
    items: response.data.data.data || [],
    total: response.data.data.total || 0,
    page: response.data.data.page || pagination.page,
    limit: response.data.data.limit || pagination.limit
  };
};

// Custom hook
export function useCompanies(filter: CompanyFilter, sort: CompanySort, pagination: CompanyPagination) {
  const companiesQuery = useQuery({
    queryKey: ['companies', filter, sort, pagination],
    queryFn: () => fetchCompanies(filter, sort, pagination),
    staleTime: 5000, // Smooth pagination by keeping data fresh for 5 seconds
  });

  return {
    companies: companiesQuery.data?.items || [],
    total: companiesQuery.data?.total || 0,
    page: companiesQuery.data?.page || pagination.page,
    limit: companiesQuery.data?.limit || pagination.limit,
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error?.message || null,
  };
}
