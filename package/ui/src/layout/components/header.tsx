import { Box, Grid, IconButton, Typography } from "@mui/material";
import { lazy, Suspense } from "react";
import Loading from "../../components/loading";
import MenuIcon from "@mui/icons-material/Menu";
import { drawerOpenedState } from "../../state/kogen";
import { useRecoilState } from "recoil";
import useKogenQueryClient from "../../hooks/use-kogen-query-client";
import { useKogenMarketsConfigQuery } from "../../codegen/KogenMarkets.react-query";

const ChainSelect = lazy(() => import("../../components/chain-select"));
const WalletButton = lazy(() => import("../../components/wallet-button"));
// const PythPrice = lazy(() => import("../../components/spot-price"));
const LivePrice = lazy(() => import("../../components/live-price"));

export default function Header() {
  const [, setDrawerOpened] = useRecoilState(drawerOpenedState);
  // const kogenClient = useKogenQueryClient();
  // const config = useKogenMarketsConfigQuery({
  //   client: kogenClient,
  //   options: {
  //     staleTime: 300000,
  //     suspense: true,
  //   },
  // });
  // const configData = config.data!;

  return (
    <Box sx={{ p: 1 }}>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item xs={3} sm={"auto"}>
          <Box
            sx={{
              textAlign: "left",
              p: 2,
              display: { xs: "block", sm: "none" },
            }}
          >
            <IconButton aria-label="menu" onClick={() => setDrawerOpened(true)}>
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
              alignItems: { xs: "flex-end", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                mr: { xs: "0", sm: 3 },
              }}
            >
              {/* <Suspense fallback={<Loading />}>
                <PythPrice config={configData} />
              </Suspense> */}
              <Suspense fallback={<Loading />}>
                <LivePrice />
              </Suspense>
            </Box>

            {/* Chain Selector & Wallet */}
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
