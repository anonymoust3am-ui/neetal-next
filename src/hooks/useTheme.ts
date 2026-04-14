// Re-export so callers can import from either location.
// Primary implementation lives in ThemeContext to co-locate hook with provider.
export { useTheme } from '@/contexts/ThemeContext';
export type { Theme, ResolvedTheme } from '@/contexts/ThemeContext';
