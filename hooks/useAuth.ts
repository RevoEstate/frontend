import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';

// Define types
export type User = {
  _id: string;
  name: string;
  email: string;
  role?: string;
};

type SignInCredentials = {
  username: string;
  password: string;
};

// Fetch user data
const fetchUser = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get('/v1/auth/current-user');
    return response.data.user;
  } catch (err) {
    return null;
  }
};

// Auth hook
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Check auth status (get user)
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: fetchUser,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });


  // Sign in
  const signinMutation = useMutation({
    mutationFn: async (credentials: SignInCredentials) => {
      const response = await axiosInstance.post('/v1/auth/sign-in', credentials);
      return response.data.user; // Assume /signin returns user data
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'user'], user);
      // Redirect based on role
      switch (user.role) {
        case 'systemAdmin':
        case 'support':
          router.push('/dashboard');
          break;
        case 'agent':
          router.push('/realestate');
          break;
        default:
          router.push('/');
      }
    },
  });

  // Sign out
  const signoutMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/v1/auth/sign-out');
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null);
      // Clear session token cookie (adjust based on your auth provider)
      if (typeof window !== 'undefined') {
        document.cookie = 'better-auth.session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      router.push('/sign-in');
    },
  });

  // Helper to check role
  const hasRole = (roles: string | string[]): boolean => {
    if (!user || !user.role) return false;
    return typeof roles === 'string' ? user.role === roles : roles.includes(user.role);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error: error?.message || signinMutation.error?.message || null,
    signin: signinMutation.mutateAsync,
    signout: signoutMutation.mutateAsync,
    hasRole,
  };
}
