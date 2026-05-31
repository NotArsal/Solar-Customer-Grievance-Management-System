/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3b3b3b',
        'brand-secondary': '#7b7b7b',
        'brand-bg': '#ffffff',
        'brand-input': '#f8f9fc',
        'brand-text': '#53545a',
        'brand-heading': '#4a4a4a',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Quicksand"', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
