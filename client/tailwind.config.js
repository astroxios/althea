/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        loginBackground: "#F0F5FF",
        athenaBlue: "#5EE0FE",
        blueHeath:"#5863F8",
        raisinBlack:"#2B2B2F",
        vanDyke: "#484041",
        lightGreen: "#70EE9C",
        oceanBlue: "#2F85FC",
        rose: "#FF6232",
      }
    },
  },
  plugins: [],
}
