import { Box, Divider, Typography, alpha } from "@mui/material";
import { Fragment } from "react";
import { clientState, contractsState } from "../../../state/cosmos";
import useTryNextClient from "../../../hooks/use-try-next-client";
import { useRecoilValue } from "recoil";
import {
  useKogenMarketsAsksQuery,
  useKogenMarketsBidsQuery,
} from "../../../codegen/KogenMarkets.react-query";
import { KogenMarketsQueryClient } from "../../../codegen/KogenMarkets.client";

export default function Orderbook() {
  const contracts = useRecoilValue(contractsState);
  const client = useRecoilValue(clientState);
  const tryNextClient = useTryNextClient();

  const kogenClient = new KogenMarketsQueryClient(client, contracts);

  const bids = useKogenMarketsBidsQuery({
    client: kogenClient,
    args: {},
    options: {
      staleTime: 3000000,
      onError: tryNextClient,
      suspense: true,
    },
  });

  const asks = useKogenMarketsAsksQuery({
    client: kogenClient,
    args: {},
    options: {
      staleTime: 3000000,
      onError: tryNextClient,
      suspense: true,
    },
  });

  return (
    <Fragment>
      <Box sx={{ height: "400px", overflowY: "auto" }}>
        <Box sx={{ position: "sticky", top: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{ display: "inline-block", width: "30%", textAlign: "right" }}
            >
              Price <strong>USDT</strong>
            </Typography>
            <Typography variant="caption">
              Size <strong>ATOM</strong>
            </Typography>
          </Box>
          <Divider />
        </Box>
        <Box sx={{ p: 1, pt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "monospace",
                fontWeight: "bold",
                display: "inline-block",
                width: "30%",
                textAlign: "right",
              }}
              color="primary"
            >
              1.500
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
              0.200
            </Typography>
          </Box>
        </Box>
        <Box sx={{ background: alpha("#000000", 0.2), height: "20px" }}></Box>
        <Box sx={{ p: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "monospace",
                fontWeight: "bold",
                display: "inline-block",
                width: "30%",
                textAlign: "right",
              }}
              color="secondary"
            >
              1.490
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
              0.200
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}
