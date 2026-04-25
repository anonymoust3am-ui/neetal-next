import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  BarChart2,
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  GraduationCap,
  ListChecks,
  Heart,
} from 'lucide-react';

export interface BottomNavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

export const bottomNavItems: BottomNavItem[] = [
    {
    key: 'choices',
    label: 'Choices List',
    icon: Heart,
    href: '/dashboard/choices',
  },
  {
    key: 'predictor',
    label: 'Predictor',
    icon: Sparkles,
    href: '/dashboard/predictor',
  },
  {
    key: 'compare',
    label: 'Compare',
    icon: BarChart2,
    href: '/dashboard/compare',
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    key: 'insights',
    label: 'Insights',
    icon: TrendingUp,
    href: '/dashboard/insights',
  },
  {
    key: 'resources',
    label: 'Resources',
    icon: BookOpen,
    href: '/dashboard/resources',
  },
  {
    key: 'institutes',
    label: 'Institutes',
    icon: GraduationCap,
    href: '/dashboard/institutes',
  }
];