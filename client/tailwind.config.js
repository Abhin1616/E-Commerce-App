/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      textShadow: {
        'white': '0 0 5px rgba(255, 255, 255, 0.7)',
        'black': '0 0 5px rgba(0, 0, 0, 0.7)',
        // Add more colors as needed
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-white': {
          textShadow: '0 0 5px rgba(255, 255, 255, 0.7)',
        },
        '.text-shadow-black': {
          textShadow: '0 0 5px rgba(0, 0, 0, 0.7)',
        }
      }
      addUtilities(newUtilities)
    }
  ],

}

