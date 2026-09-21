/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'night-mauve': 'var(--night-mauve)',
        'blood-red': 'var(--blood-red)',
        'deep-black': 'var(--deep-black)',
      },
    },
  },
  plugins: [],
}

