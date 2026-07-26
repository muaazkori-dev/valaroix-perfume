/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        valaroix: {
          dark: '#070709',
          card: '#0e0e13',
          border: 'rgba(212, 175, 55, 0.25)',
          gold: '#d4af37',
          goldLight: '#f6e6b4',
          goldDark: '#997a15',
          amber: '#e67e22',
          rose: '#e0a96d',
          emerald: '#10b981',
          cyan: '#06b6d4',
          purple: '#a855f7'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 3s infinite linear',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
