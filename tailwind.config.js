/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        di: {
          dark: "#1C2024",
          "dark-secondary": "#181818",
          "dark-tertiary": "#7E808A",
          "slate-900": "#8B8D98",
          gray: "#EBEBEF",
          "gray-secondary": "#E4E4E9",
          "gray-tertiary": "#F9F9FB",
        },
      },
    },
  },
  plugins: [],
};
