import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Bookmark {
  _id: string;
  propertyId: any;
}

const fetchBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/bookmark`,
      { withCredentials: true }
    );
    return response?.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const useBookmarks = () => {
  return useQuery<Bookmark[], Error>({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
};