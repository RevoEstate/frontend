import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from "@/lib/auth-client";

export const useMyPackages = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<any, Error>({
    queryKey: ['company-purchases', userId],
    queryFn: async () => {
     try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/payment/getcompanyPurchase`,
        { withCredentials: true }
      );

      // Handle empty response gracefully
      if (response.status === 404) {
        return [];
      }

      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch company packages');
      }

      return response.data.data || [];
     } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle 404 as empty array
        if (error.response?.status === 404) {
          return [];
        }
        // Convert other axios errors to Error instances
        throw new Error(error.response?.data?.message || 'Network error occurred');
      }
      throw error;
     }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      // Don't retry for 404 errors
      if (error.message === 'Not Found') return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};