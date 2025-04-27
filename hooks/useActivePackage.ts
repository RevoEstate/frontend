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

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/payment/getactivecompanysubscription`,
        { withCredentials: true }
      );

      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch active subscription');
      }

      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};