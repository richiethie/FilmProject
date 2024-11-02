/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        darkBlue: '#1A1F4D',
        mediumGray: '#B0B3B8',
        lightGray: '#E0E0E0',
        burntOrange: '#ff764b',
        offWhite: '#F9F9F9',
      },
    },
  },
  plugins: [],
}

