import daisyui from "daisyui"
import themes from "daisyui/theme/object"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "luxury","cupcake","lofi"

    ],

  },
}

