/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      screens: {
        sm: '500px',
        md: '640px',
        lg: '768px',
        xl: '960px',
        '2xl': '1280px',
      },
    },
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
    // darkTheme: 'dark',
    themes: ["cupcake", "dark"],
  },
}
