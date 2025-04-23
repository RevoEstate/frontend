import { useQuery } from '@tanstack/react-query';
import { RealEstate } from './useRealestateByUser';

type ApiResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: RealEstate | null;
};

export const useRealestateById = (realestateId?: string) => {
  const fetchRealestateById = async (id: string): Promise<ApiResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/companies/getCompany/${id}`,
      {
        method: 'GET',
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch realestate: ${response.statusText}`);
    }

    return response.json();
  };

  const realestateQuery = useQuery({
    queryKey: ['realestate', realestateId],
    queryFn: () => fetchRealestateById(realestateId!),
    enabled: !!realestateId, // Only run query when realestateId exists
    select: (data) => data.data || null,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    realestate: realestateQuery.data,
    isLoading: realestateQuery.isLoading,
    isFetching: realestateQuery.isFetching,
    error: realestateQuery.error,
    isError: realestateQuery.isError,
    refetch: realestateQuery.refetch,
  };
};