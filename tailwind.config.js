/** @type {import('tailwindcss').Config} */

import { createThemes } from 'tw-colors'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  plugins: [
    createThemes({
       'light': {
         'bg': '#FFFFFF',
         'bg2': '#F6F8F9',
         'text': '#252C32',
         'textSec': '#5B6871',
         'textSec2': '#6E7C87',
         'textButton': '#F6F8F9',
         'blue': '#0E73F6',
         'red': '#CC0905',
         'green': '#119C2B',
         'yellow': '#D29404',
         'separator': '#EEF0F2',
         'icon': '#6E7C87',
         'icon2': '#252C32',
       },
       'dark': {
         'bg': '#252C32',
         'bg2': '#1A2024',
         'text': '#F6F8F9',
         'textSec': '#9AA6AC',
         'textSec2': '#6E7C87',
         'textButton': '#F6F8F9',
         'blue': '#4094F7',
         'red': '#F76659',
         'green': '#47D16C',
         'yellow': '#F8DD4E',
         'separator': '#303940',
         'icon': '#6E7C87',
         'icon2': '#F6F8F9',
       },
    })
 ],
  theme: {
    extend: {
      backgroundImage: {
        'pro': 'linear-gradient(to right, #1C6ED8, #0CD7E4FC)',
      },
      animation: {
        skeleton: 'skeleton 1s linear infinite',
      },
      keyframes: {
        skeleton: {
          '0%': { backgroundPosition: '100% center' },
          '100%': { backgroundPosition: '-100% center' },
        },
      },
      screens: {
        'touchscreen': {'raw': 'not (hover: hover)'},
      }
    }
  }
}

