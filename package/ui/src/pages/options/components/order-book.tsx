import { Box, Divider, Typography, alpha } from "@mui/material";
import { Fragment } from "react";
import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react-lite";
import Decimal from "decimal.js";
import AdjustIcon from "@mui/icons-material/Adjust";
import {
  useKogenMarketsAsksQuery,
  useKogenMarketsBidsQuery,
  useKogenMarketsConfigQuery,
} from "../../../codegen/KogenMarkets.react-query";
import {
  OrderBookItem,
  OrdersResponse,
} from "../../../codegen/KogenMarkets.types";
import { chainState } from "../../../state/cosmos";
import { metamaskAddressState } from "../../../state/injective";
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";

function sumOrders(orders?: OrderBookItem[]) {
  if (!orders) {
    return new Decimal(0);
  }

  return orders.reduce(
    (acc, o) => acc.plus(o.quantity_in_base),
    new Decimal(0),
  );
}

function includesSender(orders: OrderBookItem[], sender?: string) {
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
  const chain = useRecoilValue(chainState);
  const { address: cosmosAddress } = useChain(chain.chain_name);
  const metamaskAddress = useRecoilValue(metamaskAddressState);
  const address = cosmosAddress || metamaskAddress?.injective;

  const kogenClient = useKogenQueryClient();
  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
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
          width: "40%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
        color={color}
      >
        {includesSender(order.orders, address) && (
          <AdjustIcon
            fontSize="inherit"
            color={color}
            sx={{ fontSize: "12px" }}
          />
        )}
        <span style={{ flexGrow: 1, textAlign: "right" }}>
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
  const kogenClient = useKogenQueryClient();

  const bids = useKogenMarketsBidsQuery({
    client: kogenClient,
    args: {},
    options: {
      staleTime: 10000,
      refetchInterval: 10000,
      suspense: true,
    },
  });

  const asks = useKogenMarketsAsksQuery({
    client: kogenClient,
    args: {},
    options: {
      staleTime: 10000,
      refetchInterval: 10000,
      suspense: true,
    },
  });

  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
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
              sx={{ display: "inline-block", width: "40%", textAlign: "right" }}
            >
              Price <strong>{config.data?.quote_symbol}</strong>
            </Typography>
            <Typography variant="caption">
              Size <strong>{config.data?.base_symbol}</strong>
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
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <OrdersItem order={bid} color="secondary" />
            </Box>
          ))}
        </Box>
      </Box>
    </Fragment>
  );
}
