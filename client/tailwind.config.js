/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        pitch: '#030704',
        black: '#000000',
        emerald: {
          400: '#00ff88',
          500: '#00e575',
          600: '#00b85c',
          950: '#03140a'
        },
        cyber: {
          neon: '#00ff88',
          cyan: '#00e5ff',
          crimson: '#ff0055',
          amber: '#ffb700',
          purple: '#b026ff',
          card: 'rgba(5, 20, 12, 0.65)'
        }
      },
      boxShadow: {
        'neon-green': '0 0 25px rgba(0, 255, 136, 0.35)',
        'neon-cyan': '0 0 25px rgba(0, 229, 255, 0.35)',
        'neon-crimson': '0 0 25px rgba(255, 0, 85, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.7)',
        'glass-hover': '0 12px 40px 0 rgba(0, 255, 136, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2.5s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 255, 136, 0.25)' },
          '100%': { boxShadow: '0 0 35px rgba(0, 255, 136, 0.6), 0 0 15px rgba(0, 229, 255, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
