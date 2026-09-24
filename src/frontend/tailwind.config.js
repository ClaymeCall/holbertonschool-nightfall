import colors from 'tailwindcss/colors';
import daisyui from 'daisyui';

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
      fontFamily: {
        display: ['"Metal Mania"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Special Elite"', '"Courier New"', 'monospace'],
        ui: ['"Trebuchet MS"', '"Segoe UI"', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Neon sign: brief dips in brightness, well under 3 flashes per second.
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.72' },
        },
      },
      // "backwards" (not "both"): once finished, the element goes back to its own
      // styles, so hover transforms keep working.
      animation: {
        'fade-up': 'fade-up 0.5s ease-out backwards',
        flicker: 'flicker 6s infinite',
      },
    },
  },
  plugins: [daisyui],
}
