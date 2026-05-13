/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'card-dark': '#1a1f3a',
        'card-accent': '#2d1f4a',
        'gold': '#d4af37',
        'gold-light': '#e6c847',
        'forest': '#6b9d7a',
        'danger': '#c73e1d',
        'bg-primary': '#0a0e1a',
        'bg-secondary': '#1a1f3a',
        'text-primary': '#f5f1e8',
        'text-secondary': '#a0a0a0',
        'accent-gold': '#c5a059',
        'accent-red': '#4a0e0e',
        'accent-blue': '#1b2d3c',
        'accent-purple': '#2d1b3c',
        'accent-green': '#3d5a45',
        'accent-muted': '#605840',
      },
      fontFamily: {
        'serif': ['"Crimson Text"', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'card-hover': 'card-hover 0.3s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        'card-hover': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%, 100%': { opacity: '0.6', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slideUp': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.4)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.6)',
        'card': '0 8px 32px rgba(0,0,0,0.5)',
        'enemy': '0 4px 20px rgba(199, 62, 29, 0.3)',
      },
    },
  },
  plugins: [],
}
