/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        amatic: ['"Amatic SC"', 'cursive'],
        montserrat: ['Montserrat', 'sans-serif'],
        montserratAlt: ['"Montserrat Alternates"', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        zilla: ['"Zilla Slab"', 'serif'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

