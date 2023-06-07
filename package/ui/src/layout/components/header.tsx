import { Box, Grid, IconButton } from "@mui/material";
import { lazy, Suspense } from "react";
import Loading from "../../components/loading";
import MenuIcon from "@mui/icons-material/Menu";
import { drawerOpenedState } from "../../state/kogen";
import { useRecoilState } from "recoil";

const ChainSelect = lazy(() => import("../../components/chain-select"));
const WalletButton = lazy(() => import("../../components/wallet-button"));

export default function Header() {
  const [, setDrawerOpened] = useRecoilState(drawerOpenedState);

  return (
    <Box
      sx={{
        p: 1,
      }}
    >
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item xs={3} sm={"auto"}>
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
        <Grid item xs={9} sm={"auto"} sx={{ textAlign: "right" }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Suspense fallback={<Loading />}>
                <ChainSelect />
              </Suspense>
            </Box>
            <Suspense fallback={<Loading />}>
              <WalletButton />
            </Suspense>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
