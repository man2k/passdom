/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "luxury",
      "dracula",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "black",
      "business",
      "night",
      "coffee",
      "aqua",
      // "cupcake",
      // "bumblebee",
      // "emerald",
      // "corporate",
      // "synthwave",
      // "lofi",
      // "pastel",
      // "fantasy",
      // "wireframe",
      // "cmyk",
      // "autumn",
      // "acid",
      // "lemonade",
      // "winter",
    ],
    base: true,
    styled: true,
    utils: true,
  },
};
