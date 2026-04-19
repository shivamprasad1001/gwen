/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0B0C10",
        darker: "#1F2833",
        accent: "#66FCF1",
        muted: "#45A29E",
        text: "#C5C6C7"
      }
    },
  },
  plugins: [],
}
