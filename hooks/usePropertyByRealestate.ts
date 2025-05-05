import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from "@/lib/auth-client";


export const usePropertyByRealestate = (page: number = 1) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;

  return useQuery<any, Error>({
    queryKey: ['company-properties', userId],
    queryFn: async () => {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
          const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/companyproperties`,
              { 
                  params: { page },
                  withCredentials: true,
              },
          );

          // Handle empty case gracefully
          if (response.status === 404) {
              return [];
          }

          if (response.status !== 200 || !response.data.success) {
              throw new Error(response.data.message || 'Failed to fetch properties');
          }

          return response.data.data || []; // ensure array is returned
      } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
              return []; // return empty array for 404
          }
          throw error; // rethrow other errors
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};