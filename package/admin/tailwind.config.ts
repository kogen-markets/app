import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");
const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['"sf-pro"'],
      },
      colors: {
        black: "#111827",
        // border: "hsl(var(--border))",
        input: {
          DEFAULT: "#ffffff",
        },
        placeholder: {
          DEFAULT: "#777777",
        },
        // ring: "hsl(var(--ring))",
        background: "#ffffff",
        dark: {
          DEFAULT: "#1F1F1F",
        },
        foreground: { DEFAULT: "#FFFFFF", secondary: "#F1EDE9" },
        primary: {
          DEFAULT: "#9945FF",
          foreground: "#FFFFFF",
          hover: "#D15700",
        },
        secondary: {
          DEFAULT: "#ABABAB",
          foreground: "#ffffff",
        },
        // destructive: {
        //   DEFAULT: "#ef4444",
        //   foreground: "hsl(var(--destructive-foreground))",
        // },
        // muted: {
        //   DEFAULT: "#464443",
        //   foreground: "#707070",
        // },
        // accent: {
        //   DEFAULT: "hsl(var(--accent))",
        //   foreground: "hsl(var(--accent-foreground))",
        // },
        // success: {
        //   DEFAULT: "#8BFF78",
        //   light: "#D8FEC5",
        // },
        // popover: {
        //   DEFAULT: "hsl(var(--popover))",
        //   foreground: "hsl(var(--popover-foreground))",
        // },
        // card: {
        //   DEFAULT: "hsl(var(--card))",
        //   foreground: "hsl(var(--card-foreground))",
        // },
      },
      // backgroundImage: {
      //   auth_carousel_1: "url('/images/auth/carousel_1.webp')",
      //   auth_carousel_2: "url('/images/auth/carousel_2.webp')",
      //   auth_carousel_3: "url('/images/auth/carousel_3.webp')",
      //   game_fv_battle: "url('/images/games/fv_battle.webp')",
      //   game_p1_info: "url('/images/games/p1_info.webp')",
      //   game_p2_info: "url('/images/games/p2_info.webp')",
      //   linear_1:
      //     "linear-gradient(to right, rgba(2, 6, 23, 1) 0%, rgba(2, 6, 23, 0.94) 8%, rgba(2, 6, 23, 0.84) 40%, rgba(2, 6, 23, 0.49) 50%, rgba(2, 6, 23, 0.17) 100%)",
      //   linear_2:
      //     "linear-gradient(to top right,rgba(2, 6, 23, 100%) 0%, rgba(2, 6, 23, 0.89) 25%, rgba(2, 6, 23, 0.51) 50%, rgba(2, 6, 23, 0) 100%)",
      //   radial_1:
      //     "radial-gradient(circle, rgba(2, 6, 23, 11%) 70%, rgba(2, 6, 23, 65%) 95%, rgba(2, 6, 23, 78%) 120%);",
      //   radial_2:
      //     "radial-gradient(closest-side, rgba(220, 38, 38, 0.75) 0%, transparent 100%);",
      //   radial_3:
      //     "radial-gradient(closest-side, rgba(37, 99, 235, 0.75) 0%, transparent 100%);",
      //   radial_4:
      //     "radial-gradient(closest-side, rgba(239, 68, 68, 1) 0%, transparent 100%);",
      //   radial_5:
      //     "radial-gradient(closest-side, rgba(37, 99, 235, 1) 0%, transparent 100%);",
      // },
      screens: {
        xs: "375px",
        ss: "425px",
        sm: "640px",
        tb: "768px",
        lg: "1024px",
        pc: "1280px",
        xl: "1536px",
        "2xl": "1920px",
      },
      keyframes: {
        moveLeft: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-400%)" },
        },
      },
      animation: {
        moveLeft: "moveLeft 10s linear infinite",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};

export default config;
