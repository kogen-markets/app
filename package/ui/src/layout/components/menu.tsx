import {useState} from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
} from "@mui/material";
import { Link as MuiLink } from "@mui/material";
import { Fragment, Suspense, lazy } from "react";

import AltRouteIcon from "@mui/icons-material/AltRoute";
import QuizIcon from "@mui/icons-material/Quiz";

import { Link, useLocation } from "react-router-dom";
import ThemeSelector from "../../components/theme-selector";
import { useTheme } from "@emotion/react";
import Loading from "../../components/loading";
import { useRecoilValue } from "recoil";
import { contractBaseDenomsState } from "../../state/kogen";
const ChainSelect = lazy(() => import("../../components/chain-select"));

export default function Menu() {
  const location = useLocation();
  const currentPathname: string = location.pathname;
  //@ts-ignore
  const isDarkTheme = useTheme().palette.mode === "dark";

  function getPathnameElements(n: number): string {
    return currentPathname
      .split("/")
      .slice(0, 1 + n)
      .join("/");
  }

    // State to control the visibility of submenu items
    const [submenuOpen, setSubmenuOpen] = useState(true);

    // Toggles the state
    const toggleSubmenu = () => {
      setSubmenuOpen(!submenuOpen);
    };

  return (
    <Fragment>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box>
          <Box>
            <MuiLink
              to="/"
              color={"secondary"}
              sx={{
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
                my: { xs: 1, lg: 5 },
              }}
              component={Link}
            >
              {isDarkTheme ? (
                <img src="/kogen-logo-dark.png" width="100%" />
              ) : (
                <img src="/kogen-logo-white.png" width="100%" />
              )}
            </MuiLink>
          </Box>
          <Box sx={{ display: { xs: "block", sm: "none" }, px: 2 }}>
            <Suspense fallback={<Loading />}>
              <ChainSelect FormControlProps={{ fullWidth: true }} />
            </Suspense>
          </Box>
          <List
            sx={{ width: "100%" }}
            component="nav"
            aria-labelledby="options"
          >
            <List
              component="div"
              sx={{
                "&& .Mui-selected": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.secondary.main, 0.2),
                },
                "& .MuiListItemButton-root": {
                  mx: 2,
                  my: 1,
                  borderRadius: "5px",
                  border: (theme) =>
                    "1px solid " + alpha(theme.palette.secondary.light, 0.2),
                  "&:hover": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.secondary.main, 0.2) + "!important",
                  },
                },
              }}
            >
              <ListItemButton
                component={Link}
                to={"/options/call-week1"}
                onClick={toggleSubmenu} // Toggle submenu on click
              >
                <ListItemIcon>
                  <AltRouteIcon />
                </ListItemIcon>
                <ListItemText primary="ATOM/USDT" />
              </ListItemButton>
              {submenuOpen && (
              <List
                component="div"
                disablePadding
                sx={{
                  "&& .Mui-selected": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.secondary.main, 0.2),
                  },
                  "& .MuiListItemButton-root": {
                    ml: 4,
                    pl: 4,
                    "&:hover": {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.secondary.main, 0.2) + "!important",
                    },
                  },
                }}
              >

                <ListItemButton
                  component={Link}
                  to={"/options/call-week1"}
                  selected={getPathnameElements(2) === "/options/call-week1"}
                >
                  <ListItemText primary="Current week's call" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to={"/options/call-week2"}
                  selected={getPathnameElements(2) === "/options/call-week2"}
                >
                  <ListItemText primary="Following week's call" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to={"/options/put-week1"}
                  selected={getPathnameElements(2) === "/options/put-week1"}
                >
                  <ListItemText primary="Current week's put" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to={"/options/put-week2"}
                  selected={getPathnameElements(2) === "/options/put-week2"}
                >
                  <ListItemText primary="Following week's put" />
                </ListItemButton>

              </List>
              )}
              <ListItemButton
                component={Link}
                to={"/help"}
                disabled
                selected={getPathnameElements(1) === "/help"}
              >
                <ListItemIcon>
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText primary="Help" />
              </ListItemButton>
            </List>
          </List>
        </Box>
        <Box sx={{ mx: "auto" }}>
          <ThemeSelector />
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="caption">
              {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}
