import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B', // Vibrant coral/pink
          light: '#FF8E8E',   // Light coral
          dark: '#E55555',    // Dark coral
        },
        secondary: {
          DEFAULT: '#4ECDC4', // Vibrant teal
          light: '#7ED9D1',   // Light teal
          dark: '#3DB8B0',    // Dark teal
        },
        accent: {
          orange: '#FF9F43',  // Vibrant orange
          yellow: '#FEE501',  // Bright yellow
          green: '#26D0CE',   // Bright green/cyan
          blue: '#4A90E2',    // Vibrant blue
          purple: '#9B59B6',  // Purple
        },
        neutral: {
          DEFAULT: '#F7F7F7', // Light cream/beige background
          dark: '#2C2C2C',    // Dark text
          darker: '#1A1A1A',  // Darker text
          light: '#FFFFFF',   // Pure white
        },
        text: {
          DEFAULT: '#2C2C2C', // Dark text
          light: '#666666',   // Light text
          dark: '#1A1A1A',    // Darker text
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.05)',
        'hover': '0 4px 6px -1px rgba(139, 92, 246, 0.1), 0 2px 4px -1px rgba(139, 92, 246, 0.06)', // Softer violet shadow
      }
    },
  },
  plugins: [],
} satisfies Config;
