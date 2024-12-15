/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        charcoal: '#10161c',
        darkCharcoal: '#080c0f',
        cornflowerBlue: '#4f76f6',
        crispWhite: '#f9f9f9',
        mintGreen: '#77f2a1',
        steelGray: '#A3ABB5',
        transparent: 'rgba(0, 0, 0, 0)',
      },
    },
  },
  plugins: [],
};
