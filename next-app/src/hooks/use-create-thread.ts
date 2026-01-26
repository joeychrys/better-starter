import { Client } from '@langchain/langgraph-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useAuthJwt } from './use-auth-jwt';

export function useCreateThread() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: jwt } = useAuthJwt();

  const mutation = useMutation({
    mutationFn: async () => {
      const client = new Client({
        apiUrl: 'http://localhost:8000',
        defaultHeaders: {
          ...(jwt && { Authorization: `Bearer ${jwt}` }),
        },
      });

      // Create thread on server with a new UUID
      const threadId = crypto.randomUUID();
      return client.threads.create({ threadId });
    },
    onSuccess: (newThread) => {
      // Invalidate threads list to include the new thread
      queryClient.invalidateQueries({ queryKey: ['threads'] });

      // Navigate to the new thread
      router.push(`/chat?thread=${newThread.thread_id}`);
    },
  });

  return {
    createThread: mutation.mutate,
    isCreating: mutation.isPending,
  };
}
