import colors from 'tailwindcss/colors';

// Colors backed by CSS variables (src/index.css). The `<alpha-value>` placeholder
// keeps opacity modifiers working (e.g. `bg-accent/60`).
const themeColor = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: themeColor('canvas'),
        surface: themeColor('surface'),
        line: themeColor('line'),
        ink: {
          DEFAULT: themeColor('ink'),
          muted: themeColor('ink-muted'),
        },
        accent: {
          DEFAULT: themeColor('accent'),
          fg: themeColor('accent-fg'),
        },
        highlight: themeColor('highlight'),

        // Blue-tinted neutrals so existing gray-* classes match the navy palette.
        gray: colors.slate,

        // Legacy names, still used by pages not migrated to the roles above yet.
        'night-mauve': '#7689f5',
        'blood-red': '#c34e63',
        'deep-black': '#020415',
      },
    },
  },
  plugins: [],
}
