"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CopilotChat, CopilotKitCSSProperties, InputProps } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { Send, Square } from "lucide-react";
import { KeyboardEvent, useRef } from "react";

function ChatInput({ inProgress, onSend, isVisible }: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const value = textareaRef.current?.value.trim();
    if (value && !inProgress) {
      onSend(value);
      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-background py-4 w-full max-w-5xl mx-auto">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Message..."
          disabled={inProgress}
          rows={1}
          className={cn(
            "min-h-[44px] max-h-[160px] resize-none",
            "border-muted-foreground/20 bg-muted/30",
            "focus-visible:ring-1 focus-visible:ring-ring"
          )}
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={inProgress}
          className="h-11 w-11 shrink-0"
        >
          {inProgress ? (
            <Square className="h-4 w-4 fill-current" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div
      className="h-[calc(100vh-66px)] mx-auto max-w-6xl"
      style={
        {
          "--copilot-kit-primary-color": "var(--primary)",
          "--copilot-kit-contrast-color": "var(--primary-foreground)",
          "--copilot-kit-background-color": "var(--background)",
          "--copilot-kit-secondary-color": "var(--card)",
          "--copilot-kit-secondary-contrast-color": "var(--foreground)",
          "--copilot-kit-separator-color": "var(--border)",
          "--copilot-kit-muted-color": "var(--muted-foreground)",
        } as CopilotKitCSSProperties
      }
    >
      <CopilotChat
      
        className="h-full"
        Input={ChatInput}
        labels={{
          initial: "How can I help you today?",
        }}
      />
    </div>
  );
}
