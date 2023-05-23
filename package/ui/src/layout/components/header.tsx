import { Box, Grid, IconButton } from "@mui/material";
import { lazy, Suspense } from "react";
import Loading from "../../components/loading";
import MenuIcon from "@mui/icons-material/Menu";
import { drawerOpenedState } from "../../state/kogen";
import { useRecoilState } from "recoil";

const KeplrButton = lazy(() => import("../../components/keplr-button"));

export default function Header() {
  const [, setDrawerOpened] = useRecoilState(drawerOpenedState);

  return (
    <Box
      sx={{
        p: 1,
      }}
    >
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item xs={6} sm={"auto"}>
          <Box
            sx={{
              textAlign: "left",
              p: 2,
              display: { xs: "block", sm: "none" },
            }}
          >
            <IconButton
              aria-label="delete"
              onClick={() => setDrawerOpened(true)}
            >
              <MenuIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={6} sm={"auto"} sx={{ textAlign: "right" }}>
          <Suspense fallback={<Loading />}>
            <KeplrButton />
          </Suspense>
        </Grid>
      </Grid>
    </Box>
  );
}
