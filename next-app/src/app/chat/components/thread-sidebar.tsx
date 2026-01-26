'use client';

import { MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCreateThread } from '@/hooks/use-create-thread';
import { useThreads } from '@/hooks/use-threads';

export function ThreadSidebar() {
  const { data: threads, isLoading } = useThreads();
  const { createThread } = useCreateThread();

  return (
    <Sidebar className="top-16 h-[calc(100svh-4rem)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Threads</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => createThread()}>
                  <Plus />
                  <span>New Thread</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isLoading && (
                <SidebarMenuItem>
                  <span className="text-muted-foreground px-2 py-1.5 text-sm">Loading...</span>
                </SidebarMenuItem>
              )}

              {threads?.map((thread) => (
                <SidebarMenuItem key={thread.thread_id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/chat?thread=${thread.thread_id}`}>
                      <MessageSquare />
                      <span className="truncate">{thread.thread_id.slice(0, 8)}...</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {!isLoading && threads?.length === 0 && (
                <SidebarMenuItem>
                  <span className="text-muted-foreground px-2 py-1.5 text-sm">No threads yet</span>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
