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
  LayoutGrid,
  BarChart3,
  Bot,
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
    key: 'neet-ai',
    label: 'NEET AI',
    icon: Bot,
    href: '/dashboard/ai',
  },
  {
    key: 'allotment',
    label: 'Allotment',
    icon: LayoutGrid,
    href: '/dashboard/resources',
  },
  {
    key: 'institutes',
    label: 'Institutes',
    icon: GraduationCap,
    href: '/dashboard/colleges',
  }
];