'use client';

import { MessageCircleDashed } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center">
      <div className="p-4">
        <MessageCircleDashed strokeWidth={1.25} className="h-12 w-12" />
      </div>
      <h1 className="text-2xl tracking-tight">How can I help you today?</h1>
    </div>
  );
}
