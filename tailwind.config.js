/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cherry: {
          50: '#fef1f7',
          100: '#fee5f0',
          200: '#fecce3',
          300: '#ffa2cb',
          400: '#fe68a7',
          500: '#f83c86',
          600: '#e91f64',
          700: '#ca0c47',
          800: '#a70d3b',
          900: '#8b1034',
          950: '#55021a',
        },
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["cupcake", "dark"],
  },

};
