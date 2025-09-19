/**
 * Chart color theme definitions
 * 
 * This file provides consistent color themes for all chart components
 * to ensure visual consistency across the application.
 */

export const CHART_COLORS = {
  // Primary color palette - using hsl values for better theme compatibility
  primary: 'hsl(262 83% 58%)',      // Purple (Violet-500)
  secondary: 'hsl(188 95% 43%)',    // Cyan (Cyan-500)
  tertiary: 'hsl(158 64% 52%)',     // Emerald (Emerald-500)
  quaternary: 'hsl(43 96% 56%)',    // Amber (Amber-500)
  quinary: 'hsl(0 84% 60%)',        // Red (Red-500)
  
  // Extended palette for multi-series charts
  chart1: 'hsl(262 83% 58%)',       // Purple
  chart2: 'hsl(188 95% 43%)',       // Cyan
  chart3: 'hsl(158 64% 52%)',       // Emerald
  chart4: 'hsl(43 96% 56%)',        // Amber
  chart5: 'hsl(0 84% 60%)',         // Red
  chart6: 'hsl(30 50% 35%)',        // Brown
  chart7: 'hsl(239 84% 67%)',       // Indigo
  chart8: 'hsl(330 81% 60%)',       // Pink
} as const;

/**
 * Common chart configurations
 */
export const CHART_CONFIGS = {
  desktop: {
    label: "Desktop",
    color: CHART_COLORS.primary,
  },
  mobile: {
    label: "Mobile", 
    color: CHART_COLORS.secondary,
  },
  tablet: {
    label: "Tablet",
    color: CHART_COLORS.tertiary,
  },
  visitors: {
    label: "Visitors",
    color: CHART_COLORS.chart1,
  },
  revenue: {
    label: "Revenue",
    color: CHART_COLORS.chart2,
  },
  conversions: {
    label: "Conversions",
    color: CHART_COLORS.chart3,
  },
  // Browser-specific configurations
  chrome: {
    label: "Chrome",
    color: CHART_COLORS.chart1,
  },
  safari: {
    label: "Safari", 
    color: CHART_COLORS.chart2,
  },
  firefox: {
    label: "Firefox",
    color: CHART_COLORS.chart3,
  },
  edge: {
    label: "Edge",
    color: CHART_COLORS.chart4,
  },
  other: {
    label: "Other",
    color: CHART_COLORS.chart5,
  },
} as const;