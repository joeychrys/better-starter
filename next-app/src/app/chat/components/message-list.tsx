'use client';

import type { Message } from '@langchain/langgraph-sdk';
import { useEffect, useRef } from 'react';

import { LoadingIndicator } from './loading-indicator';
import { MessageBubble } from './message-bubble';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4">
        <div className="py-8">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && messages.at(-1)?.type === 'human' && <LoadingIndicator />}
          <div ref={scrollRef} />
        </div>
      </div>
    </div>
  );
}
