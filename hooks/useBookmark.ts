import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const fetchBookmarks = async (): Promise<any[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/bookmark`,
        { withCredentials: true }
      );
      return response?.data || [];
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return []; // Return empty array instead of throwing
      }
      throw error; // Rethrow other errors
    }
  };
  

export const useBookmarks = () => {
  return useQuery<any, Error>({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
    staleTime: 1000 * 60 * 5, 
    retry: 2,
  });
};