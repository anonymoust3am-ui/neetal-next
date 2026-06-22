import { ScrollProgressBar } from '@/components/dashboard/ScrollProgressBar';
import { BottomNavProvider } from '@/contexts/BottomBarContext';
import { BottomNavLayout } from '@/components/bottombar/BottomBarMainContext';
import { BottomNav } from '@/components/bottombar/Bottombar';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { AuthGuard } from './AuthGuard';
import { CounsellingProvider } from '@/contexts/CounsellingContext';
import SeoKeywords from '@/components/SeoKeywords';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <SeoKeywords />
    <AuthGuard>
      <CounsellingProvider>
        <BottomNavProvider>
          <ScrollProgressBar />
          <div className="bg-background font-sans">
            <DashboardHeader />
            <BottomNav />
            <BottomNavLayout>{children}</BottomNavLayout>
          </div>
        </BottomNavProvider>
      </CounsellingProvider>
    </AuthGuard>
    </>
  );
}
