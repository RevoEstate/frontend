import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { OverviewStats, OverviewStatsResponse } from '@/types/dashboard';

// Fetch overview stats
export const fetchOverviewStats = async (): Promise<OverviewStats> => {
  const response = await axiosInstance.get<OverviewStatsResponse>('/v1/stats/overview');
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch overview stats');
  }
  return response.data.data;
};

// Hook to use overview stats
export function useOverviewStats() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['overviewStats'],
    queryFn: fetchOverviewStats,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  // Manual refresh function
  const refreshStats = () => {
    queryClient.invalidateQueries({ queryKey: ['overviewStats'] });
  };

  return {
    stats: data,
    isLoading,
    error: error?.message || null,
    refreshStats,
  };
}
