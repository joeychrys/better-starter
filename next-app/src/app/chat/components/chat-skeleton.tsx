'use client';

import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export function ChatSkeleton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Human message skeleton - right aligned */}
          <div className="mb-6 flex justify-end">
            <Skeleton className="h-12 w-48 rounded-3xl" />
          </div>

          {/* AI message skeleton - left aligned, multiple lines */}
          <div className="mb-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[75%]" />
          </div>

          {/* Human message skeleton */}
          <div className="mb-6 flex justify-end">
            <Skeleton className="h-12 w-64 rounded-3xl" />
          </div>

          {/* AI message skeleton */}
          <div className="mb-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>

      {/* Input skeleton */}
      <div className="border-t p-4">
        <div className="mx-auto max-w-2xl">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
