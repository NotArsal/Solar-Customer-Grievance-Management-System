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
        'brand-primary': '#5fa33b', // Leaf green from logo
        'brand-primary-deep': '#4a822b',
        'brand-primary-soft': '#7cc155',
        'brand-secondary': '#1d70a2', // Solar panel blue
        'brand-accent': '#f49e25', // Sun orange
        'brand-canvas': '#ffffff',
        'brand-canvas-soft': '#f4f7f9', // Soft blueish gray
        'brand-canvas-night': '#0f172a',
        'brand-canvas-night-soft': '#1e293b',
        'brand-ink': '#1b3149', // Dark navy text from logo
        'brand-ink-secondary': '#334c68',
        'brand-ink-mute': '#64748b',
        'brand-ink-mute-2': '#94a3b8',
        'brand-ink-faint': '#cbd5e1',
        'brand-hairline': '#e2e8f0',
        'brand-hairline-strong': '#cbd5e1',
        'brand-hairline-cool': '#f1f5f9',
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
