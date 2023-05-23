import { createTheme, darkScrollbar, responsiveFontSizes } from "@mui/material";

const dummyTheme = createTheme({});

const createColor = (mainColor: string) =>
  dummyTheme.palette.augmentColor({ color: { main: mainColor } });

const abstractTheme = {
  typography: {
    fontFamily: ["sans-serif"].join(","),
    h1: {
      fontSize: "2rem",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 2000,
    },
  },
  components: {
    MuiButton: {},
  },
  palette: {
    gamboge: createColor("#F0A225"),
    richBlack: createColor("#131E2B"),
    eerieBlack: createColor("#252826"),
    lion: createColor("#A38D5C"),
    celestialBlue: createColor("#2DA1DF"),
    violet: createColor("#a8189d"),
    darkblue: createColor("#2b2086"),
    bluegreen: createColor("#73C4D3"),
    red: createColor("#f34b1c"),
    darkgrey: createColor("#182123"),
    lightgrey: createColor("#eeeeee"),
  },
};

export const darkTheme = responsiveFontSizes(
  createTheme(
    {
      palette: {
        mode: "dark",
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: darkScrollbar(),
            backgroundColor: "#131e2b",
            backgroundImage: `linear-gradient(to left top, #131e2b, #13202f, #122234, #122338, #11253d)`,
          },
        },
      },
    },
    abstractTheme
  ),
  { factor: 10 }
);
export const lightTheme = responsiveFontSizes(
  createTheme(
    {
      palette: {
        mode: "light",
        primary: abstractTheme.palette.gamboge,
        secondary: abstractTheme.palette.celestialBlue,
      },
      typography: {
        allVariants: {
          color: abstractTheme.palette.richBlack.main,
        },
      },
    },
    abstractTheme
  ),
  { factor: 10 }
);

export default darkTheme;
