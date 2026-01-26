'use client';

export function LoadingIndicator() {
  return (
    <div className="mb-6 flex items-center gap-1">
      <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-pulse rounded-full" />
      <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:150ms]" />
      <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:300ms]" />
    </div>
  );
}
