import { SidebarProvider } from '@/contexts/SidebarContext';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SidebarMainContent } from '@/components/sidebar/SidebarMainContent';
import { ScrollProgressBar } from '@/components/dashboard/ScrollProgressBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ScrollProgressBar />
      <div className="bg-background font-sans">
        {/* Fixed header — full width */}
        <DashboardHeader />

        {/* Fixed sidebar — starts below header */}
        <Sidebar />

        {/* Scrollable content — shifts with sidebar + sits below header */}
        <SidebarMainContent>{children}</SidebarMainContent>
      </div>
    </SidebarProvider>
  );
}
