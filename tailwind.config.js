/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'text': '#1A2024',
      'bg': '#FFF',
      'bg2': '#F7F8F8',
      'hint': '#48535B',
      'link': '#0F77F0',
      'button': '#4094F7',
      'buttonText': '#F6F8F9',
    },
    extend: {},
  },
  plugins: [],
}

