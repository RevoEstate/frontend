import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Property } from '@/types';

interface FeaturedPropertiesResponse {
  total: number;
  properties: Property[];
}

export const useFeaturedProperties = () => {
  const fetchFeaturedProperties = async (): Promise<FeaturedPropertiesResponse> => {
    try {
      const { data } = await axios.get<{
        success: boolean;
        data: FeaturedPropertiesResponse;
        message?: string;
      }>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/featuredproperties`
      );
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch featured properties');
      }
      
      return data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      
      if (axiosError.response) {
        throw new Error(
          `Failed to fetch featured properties: ${axiosError.response.status} - ${
            axiosError.response.data?.message || axiosError.message
          }`
        );
      }
      throw new Error('Network error: Could not connect to server');
    }
  };

  return useQuery<FeaturedPropertiesResponse, Error>({
    queryKey: ['featured-properties'],
    queryFn: fetchFeaturedProperties,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};