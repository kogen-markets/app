import { Box, Divider, Typography, alpha } from "@mui/material";
import { Fragment } from "react";
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
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";
import { toUserToken } from "../../../lib/token";
import useGetAddress from "../../../hooks/use-get-address";
import { useRecoilState } from "recoil";
import { openOrderFormState } from "../../../state/kogen";
import { ORDER_TYPE, ORDER_TYPES, oppositeType } from "../../../types/types";

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

function OrdersItem({
  order,
  type,
}: {
  order: OrdersResponse;
  type: ORDER_TYPE;
}) {
  const address = useGetAddress();

  const kogenClient = useKogenQueryClient();
  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
      suspense: true,
    },
  });

  const [, setFormState] = useRecoilState(openOrderFormState);

  const priceInUser = toUserToken(order.price, config.data?.quote_decimals);
  const sizeInUser = toUserToken(
    sumOrders(order.orders),
    config.data?.base_decimals,
  );

  const color = type === ORDER_TYPES.ASK ? "primary" : "secondary";

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
        <span
          style={{ flexGrow: 1, textAlign: "right", cursor: "pointer" }}
          onClick={() => {
            setFormState((x) => ({
              ...x,
              optionPrice: priceInUser.toNumber(),
              type: oppositeType(type),
            }));
          }}
        >
          {priceInUser.toFixed(3)}
        </span>
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontFamily: "monospace", cursor: "pointer" }}
        onClick={() => {
          setFormState((x) => ({
            ...x,
            optionSize: sizeInUser.toNumber(),
            type: oppositeType(type),
          }));
        }}
      >
        {sizeInUser.toFixed(3)}
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
      staleTime: 1000,
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
              <OrdersItem order={ask} type={ORDER_TYPES.ASK} />
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
              <OrdersItem order={bid} type={ORDER_TYPES.BID} />
            </Box>
          ))}
        </Box>
      </Box>
    </Fragment>
  );
}
