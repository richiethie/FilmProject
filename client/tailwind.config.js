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
        charcoal: '#1f2b37',
        cornflowerBlue: '#4f76f6',
        crispWhite: '#f9f9f9',
        mintGreen: '#77f2a1',
        steelGray: '#A3ABB5',
        transparent: 'rgba(0, 0, 0, 0)',
      },
    },
  },
  plugins: [],
}

