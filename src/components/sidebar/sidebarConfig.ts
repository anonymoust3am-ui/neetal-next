import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Target,
  BookMarked,
  Compass,
  TrendingUp,
  LifeBuoy,
  // sub-item icons
  Sparkles,
  Hash,
  BarChart2,
  Star,
  Bookmark,
  ListChecks,
  Building2,
  BookOpen,
  Users,
  Play,
  TrendingDown,
  Grid3X3,
  Banknote,
  ClipboardCheck,
  Bot,
  Map,
  CalendarCheck,
} from 'lucide-react';

export interface SubItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;           // direct link — no sub-menu
  featured?: boolean;      // ⭐ star badge
  dividerBefore?: boolean; // thin separator line above this item
  children?: SubItem[];
}

export const sidebarItems: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    key: 'evaluate',
    label: 'Evaluate Options',
    icon: Target,
    dividerBefore: true,
    children: [
      { label: 'College Predictor',  href: '/dashboard/predictor', icon: Sparkles    },
      { label: 'Rank Explorer',      href: '/dashboard/rank',      icon: Hash        },
      { label: 'Compare Colleges',   href: '/dashboard/compare',   icon: BarChart2   },
    ],
  },
  {
    key: 'counselling',
    label: 'My Counselling',
    icon: BookMarked,
    featured: true,
    children: [
      { label: 'Recommendations',    href: '/dashboard/recommendations', icon: Star        },
      { label: 'My Shortlist',       href: '/dashboard/shortlist',       icon: Bookmark    },
      { label: 'Choice List Builder', href: '/dashboard/choices',         icon: ListChecks  },
    ],
  },
  {
    key: 'explore',
    label: 'Explore',
    icon: Compass,
    children: [
      { label: 'Colleges',    href: '/dashboard/colleges',    icon: Building2 },
      { label: 'Courses',     href: '/dashboard/courses',     icon: BookOpen  },
      { label: 'Counselling', href: '/dashboard/counselling', icon: Users     },
      { label: 'Videos',      href: '/dashboard/videos',      icon: Play      },
    ],
  },
  {
    key: 'insights',
    label: 'Insights',
    icon: TrendingUp,
    children: [
      { label: 'Cutoff Trends',       href: '/dashboard/cutoffs',    icon: TrendingDown   },
      { label: 'Seat Matrix',         href: '/dashboard/seats',      icon: Grid3X3        },
      { label: 'Fees, Bond & Stipend', href: '/dashboard/fees',       icon: Banknote       },
      { label: 'Allotment Results',   href: '/dashboard/allotment',  icon: ClipboardCheck },
    ],
  },
  {
    key: 'guidance',
    label: 'Guidance',
    icon: LifeBuoy,
    dividerBefore: true,
    children: [
      { label: 'AI Assistant', href: '/dashboard/ai',     icon: Bot          },
      { label: 'Guides',       href: '/dashboard/guides', icon: Map          },
      { label: 'Book Expert',  href: '/dashboard/expert', icon: CalendarCheck },
    ],
  },
];
