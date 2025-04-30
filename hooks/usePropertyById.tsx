import { useQuery } from '@tanstack/react-query';
import { Property } from '@/types';

type ApiResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Property;
};

export const usePropertyById = (propertyId?: string) => {
  const fetchPropertyById = async (id: string): Promise<ApiResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/getpropertybyid/${id}`,
      {
        method: 'GET',
        credentials: 'include', // Added if you need cookies
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch property: ${response.statusText}`);
    }

    return response.json();
  };

  const propertyQuery = useQuery<ApiResponse, Error, Property | null>({
    queryKey: ['property', propertyId],
    queryFn: () => fetchPropertyById(propertyId!),
    enabled: !!propertyId,
    select: (data) => data.data || null,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      if (error.message.includes('404')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });

  return {
    property: propertyQuery.data, // More semantic than just "data"
    isLoading: propertyQuery.isLoading,
    isFetching: propertyQuery.isFetching,
    error: propertyQuery.error,
    isError: propertyQuery.isError,
    refetch: propertyQuery.refetch,
  };
};