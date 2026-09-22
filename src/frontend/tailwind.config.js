/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'night-mauve': '#6a5acd',
        'blood-red': '#8b0000',
        'deep-black': '#0a0a0a',
      },
    },
  },
  plugins: [],
}
