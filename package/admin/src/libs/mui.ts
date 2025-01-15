"use client";
import { createTheme } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: blueGrey[800],
      light: blueGrey[400],
    },
    secondary: {
      main: blueGrey[50],
    },
  },
  transitions: {
    duration: {
      enteringScreen: 300,
      leavingScreen: 0,
    },
  },
});
