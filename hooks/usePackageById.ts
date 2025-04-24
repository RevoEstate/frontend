import { useQuery } from '@tanstack/react-query';

type Package = {
    _id: string;
    packageName: string;
    packagePrice: {
      usd: number;
      etb: number;
    };
    packageDuration: number;
    packageType: 'premium' | 'standard';
    packageDescription: string;
    numberOfProperties: number;
};

export const usePackageById = (packageId: string | undefined) => {
  return useQuery<Package | null, Error>({
    queryKey: ['package', packageId],
    queryFn: async () => {
      if (!packageId) {
        throw new Error('No package ID provided');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/system-admin/getpackage/${packageId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch package: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as Package | null;
    },
    enabled: !!packageId, // Only fetch when packageId exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 2,
    refetchOnWindowFocus: false,
  });
};