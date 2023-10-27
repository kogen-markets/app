import {
  Box,
  Button,
  ButtonTypeMap,
  Chip,
  ChipTypeMap,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import { useRecoilState } from "recoil";
import {
  useKogenMarketsConfigQuery,
  useKogenMarketsBidsQuery,
  useKogenMarketsAsksQuery,
} from "../../../codegen/KogenMarkets.react-query";
import { getCollateralSize, toUserToken } from "../../../lib/token";
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";
import {
  ArrayOfOrdersResponse,
  Config,
} from "../../../codegen/KogenMarkets.types";
import { useCancelOrderMutation } from "../tx";
import { snackbarState } from "../../../state/snackbar";
import { ORDER_TYPE, ORDER_TYPES } from "../../../types/types";
import useGetAddress from "../../../hooks/use-get-address";

export default function OpenOrders() {
  const kogenClient = useKogenQueryClient();
  const address = useGetAddress();

  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
      suspense: true,
    },
  });

  const bids = useKogenMarketsBidsQuery({
    client: kogenClient,
    args: {
      sender: address,
    },
    options: {
      suspense: true,
    },
  });

  const asks = useKogenMarketsAsksQuery({
    client: kogenClient,
    args: {
      sender: address,
    },
    options: {
      suspense: true,
    },
  });

  const { mutateAsync: closeOrderMutation, isLoading: isCloseOrderLoading } =
    useCancelOrderMutation();

  const [, setSnackbar] = useRecoilState(snackbarState);

  function OrdersTableBody({
    config,
    orders,
    type,
    color = "primary",
  }: {
    config: Config;
    orders: ArrayOfOrdersResponse | undefined;
    type: ORDER_TYPE;
    color?: ButtonTypeMap["props"]["color"];
  }) {
    return (
      <Fragment>
        {orders?.map((orderItem) => {
          return orderItem.orders.map((o) => {
            const collateral = getCollateralSize(
              type,
              config,
              toUserToken(o.quantity_in_base, config.base_decimals),
              toUserToken(orderItem.price, config.quote_decimals),
            );

            return (
              <TableRow
                key={orderItem.price}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">
                  <Chip
                    label={type === ORDER_TYPES.ASK ? "ask" : "bid"}
                    variant="outlined"
                    size="small"
                    color={color as ChipTypeMap["props"]["color"]}
                  />
                </TableCell>

                <TableCell align="center">
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                    }}
                  >
                    {toUserToken(
                      orderItem.price,
                      config.quote_decimals,
                    ).toFixed(3)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                    }}
                  >
                    {toUserToken(
                      o.quantity_in_base,
                      config.base_decimals,
                    ).toFixed(3)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                    }}
                  >
                    <Fragment>
                      {collateral?.amount.toFixed()} {collateral?.symbol}
                    </Fragment>
                  </Typography>
                </TableCell>
                <TableCell align="center" width={140}>
                  <Button
                    variant="text"
                    size="small"
                    color={color}
                    disabled={isCloseOrderLoading}
                    onClick={async () => {
                      setSnackbar({
                        message: "Please confirm the transaction",
                      });

                      try {
                        await closeOrderMutation({
                          type: type,
                          price: orderItem.price,
                          quantity: o.quantity_in_base,
                        });

                        setSnackbar({
                          message: `Order successfully cancelled`,
                        });
                      } catch (e: any) {
                        setSnackbar({
                          message: "Error cancelling order: " + e.message,
                        });
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            );
          });
        })}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Typography variant="caption">Open orders</Typography>

      <TableContainer component={Box}>
        <Table sx={{ width: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" width={"auto"}></TableCell>
              <TableCell align="left">
                Price ({config.data?.quote_symbol})
              </TableCell>
              <TableCell align="center">
                Size ({config.data?.base_symbol})
              </TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="right" width={"1%"}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {config.data && (
              <Fragment>
                <OrdersTableBody
                  config={config.data}
                  orders={asks.data}
                  type={ORDER_TYPES.ASK}
                  color="primary"
                />
                <OrdersTableBody
                  config={config.data}
                  orders={bids.data}
                  type={ORDER_TYPES.BID}
                  color="secondary"
                />
              </Fragment>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
    </Fragment>
  );
}
