import { useQuery } from '@tanstack/react-query';

import { authClient } from '@/lib/auth-client';

export function useAuthJwt() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: ['auth-jwt', session?.user?.id],
    queryFn: async () => {
      const response = await authClient.token();
      return response.data?.token ?? null;
    },
    staleTime: 1000 * 60 * 10, // Consider fresh for 10 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
    refetchOnWindowFocus: true, // Fresh token when user returns
    enabled: !!session?.user, // Only fetch when user is logged in
  });
}
