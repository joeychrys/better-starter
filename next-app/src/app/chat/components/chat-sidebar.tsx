"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, PenLine, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Thread {
  thread_id: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
}

async function fetchThreads(): Promise<Thread[]> {
  const response = await fetch("http://localhost:8000/threads/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      metadata: {
        graph_id: "agent",
      },
      limit: 100,
      offset: 0,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch threads");
  }

  return response.json();
}

export function AppSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentThreadId = searchParams.get("threadId");
  const newChatKey = searchParams.get("new");

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["threads", "agent"],
    queryFn: fetchThreads,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false,
  });

  // We're composing a new conversation if we have a "new" param but no threadId
  const isComposing = !currentThreadId && newChatKey !== null;

  const handleThreadClick = (threadId: string) => {
    router.push(`/chat?threadId=${threadId}`);
  };

  const handleNewChat = () => {
    // Navigate with a unique key to force CopilotKit to remount
    router.push(`/chat?new=${Date.now()}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Sidebar className="top-[64px]">
      <SidebarHeader className="border-b">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
    </Sidebar>
  );
}