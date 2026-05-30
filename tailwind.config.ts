import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#080808',
        carbon: '#121212',
        graphite: '#1f1f1f',
        champagne: '#f8e7b2',
        gold: {
          50: '#fff8df',
          100: '#ffedaa',
          200: '#ffdb6d',
          300: '#ffc53b',
          400: '#f5a90b',
          500: '#d88c06',
          600: '#ad6802',
          700: '#8a4d08',
          800: '#733f0d',
          900: '#62350f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 24px 80px rgba(245, 169, 11, 0.18)',
        soft: '0 18px 60px rgba(0, 0, 0, 0.12)'
      },
      backgroundImage: {
        'gold-grid': 'linear-gradient(rgba(245,169,11,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(245,169,11,.12) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
} satisfies Config;
