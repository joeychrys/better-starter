"use client";
import { AppSidebar } from "@/app/chat/components/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CopilotKit } from "@copilotkit/react-core";
import { useSearchParams } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider className="min-h-[calc(100vh-90px)]">
            <AppSidebar />
            <main className="w-full flex-1">
                 <CopilotKit runtimeUrl="/api/copilotkit" agent="agent">
                    {children}
                 </CopilotKit>
            </main>
        </SidebarProvider>
    );
}