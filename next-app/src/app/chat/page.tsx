'use client';

import type { Message } from '@langchain/langgraph-sdk';
import { useStream } from '@langchain/langgraph-sdk/react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { useAuthJwt } from '@/hooks/use-auth-jwt';

import { ChatInput, ChatSkeleton, EmptyState, MessageList } from './components';

function ChatContent() {
  const searchParams = useSearchParams();
  const threadId = searchParams.get('thread');

  const { data: jwt } = useAuthJwt();

  const thread = useStream<{ messages: Message[] }>({
    apiUrl: 'http://localhost:8000',
    assistantId: 'agent',
    messagesKey: 'messages',
    threadId: threadId ?? undefined,
    defaultHeaders: {
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
    },
  });

  const handleSubmit = (message: string) => {
    thread.submit({ messages: [{ type: 'human', content: message }] });
  };

  // Loading thread - show skeleton
  if (thread.isThreadLoading) {
    return <ChatSkeleton />;
  }

  // New thread (loaded but no messages) - show empty state
  if (thread.messages.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <EmptyState />
        </div>
        <ChatInput
          isLoading={thread.isLoading}
          onSubmit={handleSubmit}
          onStop={() => thread.stop()}
        />
      </div>
    );
  }

  // Has messages - show them
  return (
    <div className="flex h-full flex-col">
      <MessageList messages={thread.messages} isLoading={thread.isLoading} />
      <ChatInput
        isLoading={thread.isLoading}
        onSubmit={handleSubmit}
        onStop={() => thread.stop()}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatContent />
    </Suspense>
  );
}
