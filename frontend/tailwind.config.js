/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zoom: {
          blue: '#0E71EB',
          'blue-hover': '#0B5ED7',
          'blue-light': '#EBF4FE',
          orange: '#F26D21',
          'orange-hover': '#D95A13',
          'dark-footer': '#1A1E29',
          'dark-slate': '#1A1C23',
          'dark-bar': '#0F1015',
          'dark-card': '#242731',
          'green-accent': '#00C853',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
