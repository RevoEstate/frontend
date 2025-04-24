"use client"

import { useQuery } from '@tanstack/react-query';
import { useSession } from "@/lib/auth-client";
import { useEffect } from 'react';

// Type definitions
type SocialMedia = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  whatsapp?: string;
};

type Address = {
  city: string;
  region: string;
  specificLocation: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type RealEstate = {
  _id: string;
  userId: string;
  realEstateName: string;
  description: string;
  email: string;
  phone: string;
  address: Address;
  imageUrl: string;
  documentUrl: string;
  socialMedia: SocialMedia;
  verificationDocuments: string;
  isVerified: boolean;
  verificationStatus: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ApiResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
};

// Main hook
export const useRealestateByUserId = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const realestateQuery = useQuery({
    queryKey: ['realestate', userId],  // Unique query key - important for caching
    queryFn: () => fetchRealestateByUserId(userId!),  // Query function that will be called
    enabled: !!userId,  // Only enable the query when we have a userId
    select: (data) => data.data || null,   // Transform the data to just return the company object
    staleTime: 1000 * 60 * 5,  // Cache time (5 minutes) - how long to keep the data in cache after no components are using it
    gcTime: 1000 * 60 * 10,  // How often to refetch data when components are mounted (10 minutes)
    retry: 2,  // Don't retry failed requests too many times
    refetchOnWindowFocus: false,  // Don't refetch data when window regains focus
  });

  useEffect(() => {
    if (realestateQuery.error) {
      console.error('Realestate query error:', realestateQuery.error);
    }
  }, [realestateQuery.error]);

  return {
    realestate: realestateQuery.data,
    isLoading: realestateQuery.isLoading,
    isFetching: realestateQuery.isFetching,
    error: realestateQuery.error,
    isError: realestateQuery.isError,
    refetch: realestateQuery.refetch,
  };
};

// Fetch function
const fetchRealestateByUserId = async (userId: string): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/companies/getCompanyByUserId/${userId}`,
    {
      method: 'GET',
      credentials: "include",
    }
  );

  // if (!response.ok) {
  //   throw new Error(`Failed to fetch realestate data: ${response.statusText}`);
  // }

  return response.json();
};