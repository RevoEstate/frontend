import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from "@/lib/auth-client";


export const useActivePackage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<any | null, Error>({
    queryKey: ['active-subscription', userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/payment/getactivecompanysubscription`,
          { withCredentials: true }
        );

        // Handle 404 as no active subscription (return null)
        if (response.status === 404) {
          return null;
        }

        if (response.status !== 200 || !response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch active subscription');
        }

        return response.data.data || null;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Treat 404 as "no active subscription" rather than an error
          if (error.response?.status === 404) {
            return null;
          }
          throw new Error(error.response?.data?.message || 'Network error occurred');
        }
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};