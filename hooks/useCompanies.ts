import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { Company, CompanyFilter, CompanySort, CompanyPagination } from '@/types/company';

// Fetch companies
const fetchCompanies = async (
  filter: CompanyFilter,
  sort: CompanySort,
  pagination: CompanyPagination
): Promise<{ items: Company[]; total: number }> => {
  const params = new URLSearchParams();
  params.append('page', pagination.page.toString());
  params.append('limit', pagination.limit.toString());
  params.append('sortBy', sort.field);
  params.append('sortDirection', sort.direction);
  if (filter.search) params.append('search', filter.search);
  if (filter.verificationStatus) params.append('verificationStatus', filter.verificationStatus);
  if (filter.region) params.append('region', filter.region);

  const response = await axiosInstance.get(`/v1/companies/getAllcompany?${params.toString()}`);
  console.log('Company API Response:', response.data); // Debugging line
  return {
    items: response.data.data,
    total: response.data.data.length, // Adjust based on actual API pagination
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
    isLoading: companiesQuery.isLoading,
    error: companiesQuery.error?.message || null,
  };
}
