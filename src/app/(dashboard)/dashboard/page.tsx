// import { HeroSection }          from '@/components/dashboard/sections/HeroSection';
import { StatsSection } from '@/components/dashboard/sections/StatsSection';
import { InsightsSection } from '@/components/dashboard/sections/InsightsSection';
import { AnnouncementsSection } from '@/components/dashboard/sections/AnnouncementsSection';
import { ModulesSection } from '@/components/dashboard/sections/ModulesSection';
import { TimelineSection } from '@/components/dashboard/sections/TimelineSection';
import { VideosSection } from '@/components/dashboard/sections/VideosSection';
import { NerdUpdates } from '@/components/dashboard/sections/NerdUpdates';
import { RankInsightSection } from '@/components/dashboard/sections/RankInsightSection';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import DesktopCounsellingDashboard from '@/components/dashboard/sections/v2/DesktopCounsellingDashboard';
import { Hero2Section } from '@/components/dashboard/sections/v2/Hero2Section';
import { HeroSection } from '@/components/dashboard/sections/HeroSection';
import { UserSection } from '@/components/dashboard/sections/v2/UserSection';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <DashboardTabs />
      <div className="px-6 lg:px-8 py-6 max-w-[1500px] mx-auto space-y-6 pt-18">

        {/* <HeroSection /> */}
        <Hero2Section />

        {/* <StatsSection /> */}

        {/* <InsightsSection /> */}

        <DesktopCounsellingDashboard />

        <AnnouncementsSection />

        <UserSection />

        {/* <ModulesSection />

        <TimelineSection />  */}

        {/* videos + updates side by side */}
        {/* <div className="grid lg:grid-cols-[1fr_300px] gap-4">
          <VideosSection />
          <NerdUpdates />
        </div> */}

        {/* <RankInsightSection /> */}

      </div>
    </div>
  );
}
