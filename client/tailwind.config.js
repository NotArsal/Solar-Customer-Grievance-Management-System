/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Keeping this but we just won't use 'dark:' classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3ecf8e',
        'brand-primary-deep': '#24b47e',
        'brand-primary-soft': '#4ade80',
        'brand-canvas': '#ffffff',
        'brand-canvas-soft': '#fafafa',
        'brand-canvas-night': '#1c1c1c',
        'brand-canvas-night-soft': '#202020',
        'brand-ink': '#171717',
        'brand-ink-secondary': '#212121',
        'brand-ink-mute': '#707070',
        'brand-ink-mute-2': '#9a9a9a',
        'brand-ink-faint': '#b2b2b2',
        'brand-hairline': '#dfdfdf',
        'brand-hairline-strong': '#c7c7c7',
        'brand-hairline-cool': '#ededed',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        'display-xxl': '-1.92px',
        'display-xl': '-1.44px',
        'display-lg': '-0.72px',
        'display-md': '-0.42px',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(0,0,0,0.06)',
        'level-2': '0 8px 24px rgba(0,0,0,0.08)',
        'level-3': '0 16px 48px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
