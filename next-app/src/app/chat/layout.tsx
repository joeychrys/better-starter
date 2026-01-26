import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThreadSidebar } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-[calc(100svh-5rem)] min-h-0!">
      <ThreadSidebar />
      <SidebarInset className="relative h-full min-h-0 flex-initial! overflow-hidden">
        <SidebarTrigger className="absolute top-2 left-2 z-10" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
