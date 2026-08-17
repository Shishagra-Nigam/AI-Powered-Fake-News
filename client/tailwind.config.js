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
        pitch: '#000000',
        black: '#000000',
        matrix: {
          green: '#00ff66',
          emerald: '#00ff9d',
          lime: '#76ff03',
          crimson: '#ff0055',
          amber: '#ffaa00',
          dark: '#000000',
          card: '#030804'
        }
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 102, 0.45)',
        'neon-lime': '0 0 20px rgba(118, 255, 3, 0.45)',
        'neon-crimson': '0 0 20px rgba(255, 0, 85, 0.45)',
        'neon-amber': '0 0 20px rgba(255, 170, 0, 0.45)',
        'glass-green': '0 8px 32px 0 rgba(0, 255, 102, 0.15)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 255, 102, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(0, 255, 102, 0.8), 0 0 10px rgba(0, 255, 157, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
