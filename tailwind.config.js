/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#96B6C5',
        nude: '#F1F0E8',
        'circle-mid': '#CCE6F1',
        'circle-inner': '#EEE0C9',
        'text-main': '#666666',
        'text-sub': '#999999',
      },
    },
  },
  plugins: [],
};