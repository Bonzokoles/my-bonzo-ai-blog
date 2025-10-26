/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'theme-primary': 'var(--color-text, #000000)',
        'theme-secondary': 'var(--color-background, #ffffff)', 
        'theme-accent': 'var(--color-accent, #3b82f6)',
        'theme-accent-alt': 'var(--color-accent-alt, #06b6d4)',
      }
    },
  },
  plugins: [],
}