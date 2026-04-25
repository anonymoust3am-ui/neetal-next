import { SidebarProvider } from '@/contexts/SidebarContext';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SidebarMainContent } from '@/components/sidebar/SidebarMainContent';
import { ScrollProgressBar } from '@/components/dashboard/ScrollProgressBar';
import { BottomNavProvider } from '@/contexts/BottomBarContext';
import { BottomNavLayout } from '@/components/bottombar/BottomBarMainContext';
import { BottomNav } from '@/components/bottombar/Bottombar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BottomNavProvider>
      <ScrollProgressBar />
      <div className="bg-background font-sans">
        {/* Fixed header — full width */}
        <DashboardHeader />

        {/* Fixed sidebar — starts below header */}
        <BottomNav />

        

        {/* Scrollable content — shifts with sidebar + sits below header */}
        <BottomNavLayout>{children}</BottomNavLayout>
      </div>
    </BottomNavProvider>
  );
}
