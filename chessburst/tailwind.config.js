module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: (theme) => ({
        600: "600px",
        500: "500px",
        560: "560px",
        bottom: "calc(100vh - 4rem)",
        70: "70vh",
        "70bottom": "calc(70vh - 4rem)",
      }),
      width: (theme) => ({
        400: "400px",
        500: "500px",
        560: "560px",
        850: "850px",
      }),
      colors: (theme) => ({
        background: "#312e2b",
        nativeBlue: "#70c2ff",
        nativeDarkBlue: "#255E8B",
        darkbackground: "#272522",
      }),
      fontFamily: {
        sail: ["Sail"],
        patrick: ["Patrick Hand"],
      },
      boxShadow: {
        "2xl_blue": "rgba(112,194,255,0.35) 0px 5px 15px;",
        promotion:
          "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;",
      },
      maxWidth: {
        90: "90%",
        560: "560px",
      },
      minHeight: {
        screen: "100vh",
      },
      screens: {
        sidebars: "860px",
        statistics_md: "900px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
