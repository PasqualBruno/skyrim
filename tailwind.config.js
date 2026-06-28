/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skyrim: {
          bg: '#0c0d0f',
          bookBg: '#1e1c18',
          gold: '#c59b27',
          goldLight: '#d4af37',
          goldDark: '#8f6e16',
          parchment: '#ebdcb9',
          parchmentLight: '#f4ebd0',
          parchmentDark: '#d5c295',
          steel: '#587280',
          steelDark: '#324755',
          ink: '#2b2318',
          inkLight: '#4a3f31',
          crimson: '#8b0000',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        cinzelDeco: ['"Cinzel Decorative"', 'serif'],
        medieval: ['MedievalSharp', 'cursive'],
        crimson: ['"Crimson Text"', 'serif'],
      },
      boxShadow: {
        'skyrim-gold': '0 0 15px rgba(197, 155, 39, 0.25)',
        'skyrim-gold-lg': '0 0 25px rgba(197, 155, 39, 0.4)',
        'inner-scroll': 'inset 0 0 40px rgba(0, 0, 0, 0.08)',
        'book': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
}
