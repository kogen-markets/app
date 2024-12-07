import { Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { darkTheme, lightTheme } from "../lib/theme";
import Header from "./components/header";
import Footer from "./components/footer";
import Menu from "./components/menu";
import Snackbar from "../components/snackbar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  darkModeState,
  drawerOpenedState,
  optionContractsAddrState,
} from "../state/kogen";
import CloseIcon from "@mui/icons-material/Close";
import useKogenFactoryQueryClient from "../hooks/use-kogen-factory-query-client";
import { useKogenFactoryDeployedOptionsQuery } from "../codegen/KogenFactory.react-query";
import { chainState } from "../state/cosmos";

export default function App() {
  const chain = useRecoilValue(chainState);
  const setOptionContractsAddrState = useSetRecoilState(
    optionContractsAddrState
  );

  const factoryClient = useKogenFactoryQueryClient();
  const options = useKogenFactoryDeployedOptionsQuery({
    client: factoryClient,
    args: {
      afterDateInSeconds: Math.floor(Date.now() / 1000) - 2 * 60 * 60,
    },
    options: {
      suspense: false,
    },
  });

  useEffect(() => {
    let isMounted = true;

    if (options.data && isMounted) {
      const callOptionsAddr = options.data
        ?.filter((v) => v.option_type === "call")
        .sort(
          (b, a) =>
            Number(b.option_config.expiry) - Number(a.option_config.expiry)
        )
        .map((v) => v.addr)
        .slice(-2);
      const putOptionsAddr = options.data
        ?.filter((v) => v.option_type === "put")
        .sort(
          (b, a) =>
            Number(b.option_config.expiry) - Number(a.option_config.expiry)
        )
        .map((v) => v.addr)
        .slice(-2);

      setOptionContractsAddrState((oldAddr) => ({
        ...oldAddr,
        [chain.chain_id]: {
          call: callOptionsAddr ?? [],
          put: putOptionsAddr ?? [],
        },
      }));
    }

    return () => {
      isMounted = false;
    };
  }, [options.data, chain.chain_id, setOptionContractsAddrState]);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const darkMode = useRecoilValue(darkModeState);
  const [drawerOpened, setDrawerOpened] = useRecoilState(drawerOpenedState);
  const useDarkTheme =
    darkMode === "auto" ? prefersDarkMode : darkMode === "dark";

  return (
    <ThemeProvider theme={useDarkTheme ? darkTheme : lightTheme}>
      <Helmet>
        <title>Kogen Markets</title>
      </Helmet>
      <Snackbar />
      <CssBaseline />

      <Drawer open={drawerOpened} onClose={() => setDrawerOpened(false)}>
        <Box sx={{ textAlign: "right", p: 3 }}>
          <IconButton
            aria-label="delete"
            onClick={() => setDrawerOpened(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Menu />
      </Drawer>

      <Box>
        <Box
          sx={{
            width: { xs: 0, sm: "min(300px,30%)" },
            display: { xs: "none", sm: "block" },
            position: "fixed",
            height: "100vh",
          }}
        >
          <Menu />
        </Box>
        <Box
          sx={{
            ml: { xs: 0, sm: "min(300px,30%)" },
            height: "500px",
            minHeight: "100vh",
            p: 0,
          }}
        >
          <Header />

          <Box sx={{ px: { xs: 2, lg: 4 }, py: 2 }}>
            {options.isLoading ? (
              <div>Loading...</div>
            ) : options.error ? (
              <div>Error loading options data.</div>
            ) : (
              <Outlet />
            )}
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
