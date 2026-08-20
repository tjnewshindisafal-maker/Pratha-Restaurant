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
    },
  },
  plugins: [],
};
