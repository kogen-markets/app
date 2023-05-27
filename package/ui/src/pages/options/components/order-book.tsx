import { Box, Divider, Typography, alpha } from "@mui/material";
import { Fragment } from "react";
import useTryNextClient from "../../../hooks/use-try-next-client";
import { useRecoilValue } from "recoil";
import {
  useKogenMarketsAsksQuery,
  useKogenMarketsBidsQuery,
  useKogenMarketsConfigQuery,
} from "../../../codegen/KogenMarkets.react-query";
import { kogenMarketsQueryClientState } from "../../../state/kogen";
import {
  OrderBookItem,
  OrdersResponse,
} from "../../../codegen/KogenMarkets.types";
import Decimal from "decimal.js";
import AdjustIcon from "@mui/icons-material/Adjust";
import { keplrState } from "../../../state/cosmos";

function sumOrders(orders?: OrderBookItem[]) {
  if (!orders) {
    return new Decimal(0);
  }

  return orders.reduce((acc, o) => acc.plus(o.quantity), new Decimal(0));
}

function includesSender(orders: OrderBookItem[], sender: string | null) {
  if (!orders || !sender) {
    return false;
  }

  return orders.find((o) => o.owner === sender);
}

function formatDecimals(n: Decimal.Value, decimals = 0) {
  return new Decimal(n).mul(new Decimal(10).pow(new Decimal(-decimals)));
}

function OrdersItem({
  order,
  color,
}: {
  order: OrdersResponse;
  color: "primary" | "secondary";
}) {
  const tryNextClient = useTryNextClient();
  const keplr = useRecoilValue(keplrState);
  const kogenClient = useRecoilValue(kogenMarketsQueryClientState);
  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
      onError: tryNextClient,
      suspense: true,
    },
  });

  return (
    <Fragment>
      <Typography
        variant="body1"
        sx={{
          fontFamily: "monospace",
          fontWeight: "bold",
          display: "flex",
          width: "30%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
        color={color}
      >
        {includesSender(order.orders, keplr.account) && (
          <AdjustIcon fontSize="inherit" color={color} sx={{ pb: "2px" }} />
        )}
        <span>
          {formatDecimals(order.price, config.data?.quote_decimals)
            .toFixed(3)
            .toString()}
        </span>
      </Typography>
      <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
        {formatDecimals(sumOrders(order.orders), config.data?.base_decimals)
          .toFixed(3)
          .toString()}
      </Typography>
    </Fragment>
  );
}

export default function Orderbook() {
  const tryNextClient = useTryNextClient();
  const kogenClient = useRecoilValue(kogenMarketsQueryClientState);

  const bids = useKogenMarketsBidsQuery({
    client: kogenClient,
    args: {},
    options: {
      staleTime: 10000,
      onError: tryNextClient,
      refetchInterval: 10000,
      suspense: true,
    },
  });

  const asks = useKogenMarketsAsksQuery({
    client: kogenClient,
    args: {},
    options: {
      staleTime: 10000,
      onError: tryNextClient,
      refetchInterval: 10000,
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
        <Box
          sx={{ p: 1, pt: 2, display: "flex", flexDirection: "column-reverse" }}
        >
          {asks.data?.map((ask, ix) => (
            <Box
              key={ix}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <OrdersItem order={ask} color="primary" />
            </Box>
          ))}
        </Box>
        <Box sx={{ background: alpha("#000000", 0.2), height: "20px" }}></Box>
        <Box sx={{ p: 1 }}>
          {bids.data?.map((bid, ix) => (
            <Box
              key={ix}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <OrdersItem order={bid} color="secondary" />
            </Box>
          ))}
        </Box>
      </Box>
    </Fragment>
  );
}
