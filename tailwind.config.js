/** @type {import('tailwindcss').Config} */

import { createThemes } from 'tw-colors'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  plugins: [
    createThemes({
       'light': {
          'text': '#1A2024',
          'bg': '#FFF',
          'bg2': '#F7F8F8',
          'hint': '#48535B',
          'link': '#0F77F0',
          'button': '#4094F7',
          'buttonText': '#F6F8F9',
          'error': '#CC0905',
          'ok': '#18C549',
       },
       'dark': {
          'text': '#F6F8F9',
          'bg': '#252C32',
          'bg2': '#1A2024',
          'hint': '#B0BABF',
          'link': '#4094F7',
          'button': '#4094F7',
          'buttonText': '#F6F8F9',
          'error': '#F76659',
          'ok': '#18C549',
       },
    })
 ],
}

