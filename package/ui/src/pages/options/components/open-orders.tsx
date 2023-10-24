import {
  Box,
  Button,
  ButtonTypeMap,
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
import { useRecoilState, useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react-lite";
import {
  useKogenMarketsConfigQuery,
  useKogenMarketsBidsQuery,
  useKogenMarketsAsksQuery,
} from "../../../codegen/KogenMarkets.react-query";
import { toUserToken } from "../../../lib/token";
import { chainState } from "../../../state/cosmos";
import { metamaskAddressState } from "../../../state/injective";
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";
import { ArrayOfOrdersResponse } from "../../../codegen/KogenMarkets.types";
import { useCloseOrderMutation } from "../tx";
import { snackbarState } from "../../../state/snackbar";
import { ORDER_TYPE, ORDER_TYPES } from "../../../types/types";

export default function OpenOrders() {
  const kogenClient = useKogenQueryClient();
  const chain = useRecoilValue(chainState);
  const { address: cosmosAddress } = useChain(chain.chain_name);
  const metamaskAddress = useRecoilValue(metamaskAddressState);
  const address = cosmosAddress || metamaskAddress?.injective;

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
    useCloseOrderMutation();

  const [, setSnackbar] = useRecoilState(snackbarState);

  function OrdersTableBody({
    orders,
    type,
    text = "close ask",
    color = "primary",
  }: {
    orders: ArrayOfOrdersResponse | undefined;
    type: ORDER_TYPE;
    text?: string;
    color?: ButtonTypeMap["props"]["color"];
  }) {
    return (
      <Fragment>
        {orders?.map((orderItem) => {
          return orderItem.orders.map((o) => {
            return (
              <TableRow
                key={orderItem.price}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                    }}
                  >
                    {toUserToken(
                      o.quantity_in_base,
                      config.data?.base_decimals,
                    ).toFixed(3)}{" "}
                    {config.data?.base_symbol}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                    }}
                  >
                    {toUserToken(orderItem.price, config.data?.quote_decimals)
                      .mul(
                        toUserToken(
                          o.quantity_in_base,
                          config.data?.base_decimals,
                        ),
                      )
                      .toFixed(3)}{" "}
                    {config.data?.quote_symbol}
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
                          message: `Order successfully closed`,
                        });
                      } catch (e: any) {
                        setSnackbar({
                          message: "Error creating order: " + e.message,
                        });
                      }
                    }}
                  >
                    {text}
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
              <TableCell align="left">Size</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <OrdersTableBody
              orders={asks.data}
              type={ORDER_TYPES.ASK}
              text="close ask"
              color="primary"
            />
            <OrdersTableBody
              orders={bids.data}
              type={ORDER_TYPES.BID}
              text="close bid"
              color="secondary"
            />
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
    </Fragment>
  );
}
