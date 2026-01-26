import { Client } from '@langchain/langgraph-sdk';
import { useQuery } from '@tanstack/react-query';

import { useAuthJwt } from './use-auth-jwt';

export function useThreads() {
  const { data: jwt } = useAuthJwt();

  return useQuery({
    queryKey: ['threads', jwt],
    queryFn: async () => {
      const client = new Client({
        apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_URL || 'http://localhost:8000',
        defaultHeaders: {
          ...(jwt && { Authorization: `Bearer ${jwt}` }),
        },
      });
      return client.threads.search();
    },
    enabled: !!jwt,
  });
}
