/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        game: {
          primary: '#6C63FF',
          secondary: '#FF6584',
          accent: '#43E97B',
          dark: '#2D2B55',
          light: '#F8F9FF',
        }
      }
    },
  },
  plugins: [],
};
