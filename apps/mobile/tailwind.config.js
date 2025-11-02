/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./apps/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        // Poppins font family variants
        'Poppins': ['Poppins-Regular'],
        'PoppinsLight': ['Poppins-Light'],
        'PoppinsMedium': ['Poppins-Medium'],
        'PoppinsSemiBold': ['Poppins-SemiBold'],
        'PoppinsBold': ['Poppins-Bold'],
      },
      colors: {
        // Your custom colors
        primary: '#99225E',
        secondary: '#B8457B',
      }
    },
  },
  plugins: [],
}

