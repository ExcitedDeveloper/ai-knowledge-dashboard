/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors from style guide
        terracotta: {
          DEFAULT: '#D4816D',
          dark: '#C67161',
        },
        cream: {
          soft: '#F9F6F2',
        },
        charcoal: '#2D2D2D',
        // Secondary colors
        sage: '#8FA88E',
        clay: '#8B6F5E',
        sand: {
          warm: '#E8DED2',
        },
        // Accent colors
        sunset: '#E89B6D',
        teal: {
          deep: '#5B8A8A',
        },
        blush: '#E8C4B8',
        sky: '#A8C5D1',
        // Functional colors
        success: '#7BA877',
        warning: '#E8AE6D',
        error: '#D47B6D',
        // Text colors
        text: {
          primary: '#2D2D2D',
          secondary: '#6B6560',
          tertiary: '#A39A92',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        serif: ['Crimson Pro', 'Georgia', 'serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(45, 45, 45, 0.06)',
        DEFAULT: '0 4px 12px rgba(45, 45, 45, 0.08)',
        md: '0 4px 12px rgba(45, 45, 45, 0.08)',
        lg: '0 8px 24px rgba(45, 45, 45, 0.12)',
      },
    },
  },
  plugins: [],
};
