/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "primary-200" : "#ffbf00",
        "primary-100" : "#ffc929",
        "secondary-200" : "#37de8f",
        "secondary-100" : "#0b1a78"
      }
    },
  },
  plugins: [],
}

