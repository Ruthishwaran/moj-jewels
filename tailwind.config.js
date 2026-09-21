/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF6EE',
          100: '#F3EAD5',
          200: '#E5D2A8',
          300: '#D5B777',
          400: '#C5A059',
          500: '#B88E3E',
          600: '#9B722D',
          700: '#7A5723',
          800: '#5C3F1C',
          900: '#3D2811'
        },
        onyx: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1E293B',
          600: '#334155'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Outfit', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
