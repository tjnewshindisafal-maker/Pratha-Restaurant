/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#6e1423',
          dark: '#4a0d18',
        },
        gold: {
          DEFAULT: '#c9a24b',
          light: '#e6c878',
        },
        cream: '#fdf8f0',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        sheetUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        bump: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.18)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.35s ease-out both',
        sheetUp: 'sheetUp 0.28s cubic-bezier(0.32, 0.72, 0, 1) both',
        fadeIn: 'fadeIn 0.2s ease-out both',
        pop: 'pop 0.25s ease-out both',
        bump: 'bump 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
