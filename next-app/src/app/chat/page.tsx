'use client';

import type { Message } from '@langchain/langgraph-sdk';
import { useStream } from '@langchain/langgraph-sdk/react';
import { ArrowUp, Sparkles, Square } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { authClient } from '@/lib/auth-client';

export default function ChatPage() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { data: session } = authClient.useSession();

    const thread = useStream<{ messages: Message[] }>({
        apiUrl: 'http://localhost:8000',
        assistantId: 'agent',
        messagesKey: 'messages',
        defaultHeaders: {
            'x-user-id': session?.user?.id,
        },
    });

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [thread.messages]);

    // Auto-resize textarea
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
        thread.submit({ messages: [{ type: 'human', content: message }] });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-2xl px-4">
                    {thread.messages.length === 0 ? (
                        <div className="flex h-[70vh] flex-col items-center justify-center">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="mb-2 text-2xl font-medium tracking-tight">
                                How can I help you today?
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Ask me anything to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="py-8">
                            {thread.messages.map((message) => {
                                const isHuman = message.type === 'human';
                                return (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            'mb-6',
                                            isHuman ? 'text-right' : 'text-left'
                                        )}
                                    >
                                        {isHuman ? (
                                            <div className="inline-block max-w-[85%] rounded-3xl bg-primary px-5 py-3 text-left text-[15px] text-primary-foreground">
                                                {message.content as string}
                                            </div>
                                        ) : (
                                            <div className="text-[15px] leading-relaxed text-foreground">
                                                {message.content as string}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {/* Loading indicator */}
                            {thread.isLoading &&
                                thread.messages.length > 0 &&
                                thread.messages[thread.messages.length - 1].type === 'human' && (
                                    <div className="mb-6 flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50" />
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                                    </div>
                                )}
                            <div ref={scrollRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-border/40 bg-background pb-6 pt-4">
                <form onSubmit={handleSubmit} className="mx-auto max-w-2xl px-4">
                    <div className="relative flex items-end rounded-2xl border border-border/60 bg-muted/30 shadow-sm transition-shadow focus-within:border-border focus-within:shadow-md">
                        <textarea
                            ref={inputRef}
                            name="message"
                            placeholder="Message..."
                            autoComplete="off"
                            rows={1}
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            className="max-h-[200px] min-h-[52px] w-full resize-none bg-transparent py-4 pl-4 pr-14 text-[15px] placeholder:text-muted-foreground/60 focus:outline-none"
                        />
                        <div className="absolute bottom-2 right-2">
                            {thread.isLoading ? (
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-xl bg-muted hover:bg-muted-foreground/20"
                                    onClick={() => thread.stop()}
                                >
                                    <Square className="h-4 w-4" />
                                    <span className="sr-only">Stop</span>
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl bg-primary hover:bg-primary/90"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            )}
                        </div>
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground/60">
                        Press Enter to send, Shift + Enter for new line
                    </p>
                </form>
            </div>
        </div>
    );
}
