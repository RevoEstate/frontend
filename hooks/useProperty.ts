import { Property } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type PropertyFilters = {
  searchQuery?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  region?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  listingType?: string
};

export const useProperty = (
  filters: PropertyFilters = {},
  options: {
    enabled?: boolean;
    page?: number;
    limit?: number;
  } = {}
) => {
  const { enabled = true, page = 1, limit = 6 } = options;

  return useQuery<{ properties: Property[]; total: number }, Error>({
    queryKey: ['properties', filters, page, limit],
    queryFn: async () => {
      const params: Record<string, any> = { page, limit };

      if (filters.searchQuery) params.search = filters.searchQuery;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.minPrice) params['price[gte]'] = filters.minPrice;
      if (filters.maxPrice) params['price[lte]'] = filters.maxPrice;
      if (filters.region) params['address[region]'] = filters.region;
      if (filters.city) params['address[city]'] = filters.city;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.bathrooms) params.bathrooms = filters.bathrooms;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/allproperties`,
          { params }
        );

        if (response.status === 404 || !response.data.success) {
          // Treat 404 or success: false as empty results
          return {
            properties: [],
            total: 0,
          };
        }

        return {
          properties: response.data.data.properties,
          total: response.data.data.total,
        };
      } catch (error: any) {
        // Only throw for non-404 errors (e.g., network issues, 500)
        if (error.response?.status !== 404) {
          throw new Error(error.response?.data?.message || 'Failed to fetch properties');
        }
        // Handle 404 as empty results
        return {
          properties: [],
          total: 0,
        };
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: previousData => previousData,
  });
};