'use client';

import { ArrowUp, Square } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';

interface ChatInputProps {
  isLoading: boolean;
  onSubmit: (message: string) => void;
  onStop: () => void;
}

export function ChatInput({ isLoading, onSubmit, onStop }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const message = new FormData(form).get('message') as string;
    if (!message.trim()) return;
    form.reset();
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    onSubmit(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="bg-background pt-4 pb-6">
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-4">
        <div className="border-border/60 bg-muted/30 focus-within:border-border relative flex items-end rounded-2xl border shadow-sm transition-shadow focus-within:shadow-md">
          <textarea
            ref={inputRef}
            name="message"
            placeholder="Message..."
            autoComplete="off"
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="placeholder:text-muted-foreground/60 max-h-[200px] min-h-[52px] w-full resize-none bg-transparent py-4 pr-14 pl-4 text-[15px] focus:outline-none"
          />
          <div className="absolute right-2 bottom-2">
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="bg-muted hover:bg-muted-foreground/20 h-9 w-9 rounded-xl"
                onClick={onStop}
              >
                <Square className="h-4 w-4" />
                <span className="sr-only">Stop</span>
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                className="bg-primary hover:bg-primary/90 h-9 w-9 rounded-xl"
              >
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            )}
          </div>
        </div>
        <p className="text-muted-foreground/60 mt-2 text-center text-xs">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  );
}
