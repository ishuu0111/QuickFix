// ConsumerInterface Design System
// Premium Modern Minimal theme, built on an 8pt grid.

const palette = {
  primary: '#0D6EFD',
  primaryDark: '#0A56C7',
  secondary: '#2563EB',
  accent: '#22C55E',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#111827',
  subtitle: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#22C55E',
  white: '#FFFFFF',
  black: '#000000',
};

const darkPalette = {
  primary: '#3B82F6',
  primaryDark: '#0A56C7',
  secondary: '#60A5FA',
  accent: '#34D399',
  background: '#0B1120',
  card: '#151E30',
  text: '#F3F4F6',
  subtitle: '#9CA3AF',
  border: '#22304A',
  error: '#F87171',
  warning: '#FBBF24',
  success: '#34D399',
  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '700' },
  h4: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyMedium: { fontSize: 15, fontWeight: '600' },
  small: { fontSize: 13, fontWeight: '400' },
  tiny: { fontSize: 11, fontWeight: '500' },
};

export const shadow = {
  soft: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 6,
  },
  button: {
    shadowColor: '#0D6EFD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const gradients = {
  primary: ['#2563EB', '#0D6EFD'],
  accent: ['#34D399', '#22C55E'],
  dark: ['#111827', '#1F2937'],
  sunset: ['#FB923C', '#F43F5E'],
  ocean: ['#0EA5E9', '#2563EB'],
  purple: ['#8B5CF6', '#6366F1'],
};

export function buildTheme(isDark) {
  const colors = isDark ? darkPalette : palette;
  return {
    dark: isDark,
    colors,
    spacing,
    radius,
    typography,
    shadow,
    gradients,
  };
}

export const lightTheme = buildTheme(false);
export const darkTheme = buildTheme(true);

export default lightTheme;
