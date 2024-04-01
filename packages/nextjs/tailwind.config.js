/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}",     "./src/**/*.{js,jsx,ts,tsx}"
],
  "theme": {
    "extend": {
      "colors": {
        "white": "#fff",
        "black": "#000",
        "gainsboro": {
          "100": "#ddd",
          "200": "#d9d9d9"
        },
        "pastel-purple": "#a8a6ff",
        "pastel-blue": "#a6faff",
        "pastel-pink": "#ffa6f6",
        "gray": {
          "100": "#918f8f",
          "200": "#888383"
        },
        "mediumseagreen": {
          "100": "#4daf73",
          "200": "#3aa565",
          "300": "#2ea367"
        },
        "rainbow-stroke": "#eb9cff",
        "gold": "#ffe500",
        "darkturquoise": "#00d1de",
        "pastel-green": "#b8ff9f",
        "pastel-red": "#ff9f9f",
        "green": "#08790c",
        "darkgray": "#9f9898"
      },
      "spacing": {},
      "fontFamily": {
        "kanit": "Kanit",
        "ibm-plex-sans-devanagari": "'IBM Plex Sans Devanagari'",
        "title-small-title": "'IBM Plex Mono'"
      },
      "borderRadius": {
        "7xl": "26px",
        "7xs-9": "5.9px",
        "xl": "20px",
        "4xs-5": "8.5px",
        "7xs-7": "5.7px",
        "13xl": "32px"
      }
    },
    "fontSize": {
      "xs": "12px",
      "lg": "18px",
      "base": "16px",
      "xl": "20px",
      "8xl": "27px",
      "lgi": "19px",
      "25xl-2": "44.2px",
      "14xl-1": "33.1px",
      "6xl-8": "25.8px",
      "11xl": "30px",
      "29xl": "48px",
      "lgi-1": "19.1px",
      "3xl": "22px",
      "12xl-5": "31.5px",
      "49xl-3": "68.3px",
      "sm": "14px",
      "inherit": "inherit"
    },
  },
  plugins: [require("daisyui")],
  darkTheme: "scaffoldEthDark",
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        scaffoldEth: {
          primary: "#93BBFB",
          "primary-content": "#212638",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#DAE8FF",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },

          ".box-color": {
            "background-color": "#d4d4d8"
          }
        },
      },
      {
        scaffoldEthDark: {
          primary: "#212638",
          "primary-content": "#F9FBFF",
          secondary: "#323f61",
          "secondary-content": "#F9FBFF",
          accent: "#4969A6",
          "accent-content": "#F9FBFF",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#385183",
          "base-200": "#2A3655",
          "base-300": "#212638",
          "base-content": "#F9FBFF",
          info: "#385183",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "hsl(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },

          ".box-color": {
            "background-color": "#18181b"
          }

        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};


// Path: packages/nextjs/tailwind.css