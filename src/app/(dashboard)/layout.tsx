import { ScrollProgressBar } from '@/components/dashboard/ScrollProgressBar';
import { BottomNavProvider } from '@/contexts/BottomBarContext';
import { BottomNavLayout } from '@/components/bottombar/BottomBarMainContext';
import { BottomNav } from '@/components/bottombar/Bottombar';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { AuthGuard } from './AuthGuard';
import { CounsellingProvider } from '@/contexts/CounsellingContext';
import { DashboardAiOrb } from '@/components/dashboard/DashboardAiOrb';
import { ProfileOnboardingPrompt } from '@/components/dashboard/ProfileOnboardingPrompt';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <AuthGuard>
      <CounsellingProvider>
        <BottomNavProvider>
          <ScrollProgressBar />
          <div className="bg-background font-sans">
            <DashboardHeader />
            <BottomNav />
            <BottomNavLayout>{children}</BottomNavLayout>
            <DashboardAiOrb />
            <ProfileOnboardingPrompt />
          </div>
        </BottomNavProvider>
      </CounsellingProvider>
    </AuthGuard>
    </>
  );
}
