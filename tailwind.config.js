module.exports = {
  purge: {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [/data-theme$/],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      scale: ["group-hover"],
      animation: ["group-hover"],
      fontWeight: ["hover"],
    },
    translate: ({ after }) => after(["group-hover"]),
  },
  plugins: [require("daisyui"), require("tailwindcss-nested-groups")],
  daisyui: {
    themes: [
      {
        custom: {
          primary: "#0177FF",
          "primary-focus": "#7C3AED",
          "primary-content": "#ffffff",
          secondary: "#f000b8",
          "secondary-focus": "#bd0091",
          "secondary-content": "#ffffff",
          accent: "#01BFA6",
          "accent-focus": "#059669",
          "accent-content": "#ffffff",
          neutral: "#3d4451",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
          info: "#2094f3",
          success: "#009485",
          warning: "#FCD34D",
          error: "#ff5724",
        },
      },
    ],
  },
};
