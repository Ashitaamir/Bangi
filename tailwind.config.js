/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF3E6',
        parchment: '#F3E3C9',
        skin: {
          light: '#F1D3AC',
          DEFAULT: '#E3B685',
          dark: '#C88F58',
        },
        clay: {
          light: '#B97A4E',
          DEFAULT: '#8B5A34',
          dark: '#6B4226',
        },
        bark: {
          DEFAULT: '#4A2E1E',
          dark: '#2E1B10',
        },
        terracotta: '#B5451B',
        alpona: '#C0392B',
        gold: '#C9982B',
      },
      fontFamily: {
        display: ['"Tiro Bangla"', '"Baloo 2"', 'serif'],
        body: ['"Baloo 2"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        jute: "radial-gradient(circle at 1px 1px, rgba(74,46,30,0.08) 1px, transparent 0)",
      },
      keyframes: {
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0.7' },
          '50%': { transform: 'translateY(-10px) scaleX(1.15)', opacity: '0.4' },
          '100%': { transform: 'translateY(-22px) scaleX(0.9)', opacity: '0' },
        },
        swim: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '50%': { transform: 'translateX(12px) rotate(-3deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        steam: 'steam 2.2s ease-in-out infinite',
        swim: 'swim 3s ease-in-out infinite',
        sway: 'sway 2.6s ease-in-out infinite',
        glow: 'glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
