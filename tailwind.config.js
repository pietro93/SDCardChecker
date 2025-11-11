/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/templates/**/*.html",
    "./src/templates/**/*.js",
    "./src/js/**/*.js",
  ],
  safelist: [
    "md:min-w-[315px]",
    "md:max-w-[380px]",
    "hidden",
    "group-hover:block",
    "group-hover:opacity-100",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066cc",
        amazon: "#ff9900",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
