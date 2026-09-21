/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bleu-nuit': '#7689f5',
        'rouge-sang': '#c34e63',
        'noir-profond': '#020415',
      },
    },
  },
  plugins: [],
}

