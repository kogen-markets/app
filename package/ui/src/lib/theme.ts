import {
  alpha,
  createTheme,
  darkScrollbar,
  responsiveFontSizes,
} from "@mui/material";

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
    MuiTextField: {
      styleOverrides: {
        root: {
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              display: "none",
            },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        },
      },
    },
  },
  palette: {
    gamboge: createColor("#F0A225"),
    richBlack: createColor("#131E2B"),
    eerieBlack: createColor("#252826"),
    lion: createColor("#A38D5C"),
    celestialBlue: createColor("#2DA1DF"),
  },
};

const defaultShadows = createTheme().shadows;

export const darkTheme = responsiveFontSizes(
  createTheme(
    {
      palette: {
        mode: "dark",
        primary: abstractTheme.palette.gamboge,
        secondary: abstractTheme.palette.celestialBlue,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            html: {
              overflow: "auto",
            },
            body: {
              ...darkScrollbar(),
              background: "#131e2b",
              backgroundImage:
                "linear-gradient(330deg, rgba(19,30,43,1) 0%, rgba(16,40,69,1) 60%, rgba(27,56,91,1) 100%)",
              overflow: "auto",
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              background: alpha(abstractTheme.palette.gamboge.light, 0.1),
              boxShadow: defaultShadows[2],
            },
          },
        },
      },
    },
    abstractTheme,
  ),
  { factor: 10 },
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
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            html: {
              overflow: "auto",
            },
            body: {
              overflow: "auto",
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              background: alpha(abstractTheme.palette.richBlack.main, 0.05),
            },
          },
        },
      },
    },
    abstractTheme,
  ),
  { factor: 10 },
);

export default darkTheme;
