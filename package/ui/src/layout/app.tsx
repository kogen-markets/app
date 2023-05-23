import { Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Grid,
  ThemeProvider,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { Container } from "@mui/system";
import { Helmet } from "react-helmet";
import { Fragment } from "react";
import { darkTheme, lightTheme } from "../lib/theme";
import Header from "./components/header";
import Footer from "./components/footer";
import Menu from "./components/menu";
import Snackbar from "../components/snackbar";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../state/kogen";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const darkMode = useRecoilValue(darkModeState);

  return (
    <ThemeProvider theme={prefersDarkMode || darkMode ? darkTheme : lightTheme}>
      <Helmet>
        <title>Kogen Markets</title>
      </Helmet>
      <Snackbar />
      <CssBaseline />

      <Box sx={{}}>
        <Box
          sx={{
            width: "min(300px,30%)",
            position: "fixed",
            height: "100vh",
          }}
        >
          <Menu />
        </Box>
        <Box
          sx={{
            ml: "min(300px,30%)",
            height: "500px",
            minHeight: "100vh",
            p: 0,
          }}
        >
          <Header />

          <Box sx={{ px: 4, py: 2 }}>
            <Outlet />
          </Box>

          <Footer />
        </Box>
      </Box>

      {/* <Container maxWidth="lg"> */}

      {/* <Fragment>
        <Grid container>
          <Grid item lg={2} sm={3} xs={12}>
            <Box sx={{ position: { sm: "sticky" }, top: { sm: 8 } }}></Box>
          </Grid>
          <Grid item lg={10} sm={9} xs={12}>
            <Box sx={{ mt: 1, ml: { sm: 5 } }}></Box>
          </Grid>
        </Grid>
      </Fragment> */}
      {/* </Container> */}
    </ThemeProvider>
  );
}
