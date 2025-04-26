import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from "@/lib/auth-client";

export const useMyPackages = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<any, Error>({
    queryKey: ['company-purchases', userId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/payment/getcompanyPurchase`,
        { withCredentials: true }
      );

      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch company packages');
      }

      return response.data.data;
    },
    enabled: !!userId,
    staleTime: Infinity, // Never becomes stale
    // cacheTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnReconnect: false, // Don't refetch on network reconnect
  });
};