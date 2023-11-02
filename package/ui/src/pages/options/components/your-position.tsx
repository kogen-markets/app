import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useCallback } from "react";
import {
  useKogenMarketsLockedAmountQuery,
  useKogenMarketsConfigQuery,
} from "../../../codegen/KogenMarkets.react-query";
import { toUserToken } from "../../../lib/token";
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";
import useGetAddress from "../../../hooks/use-get-address";
import useGetPosition from "../../../hooks/use-get-position";
import { useRecoilState } from "recoil";
import { externalOpenOrderFormState } from "../../../state/kogen";
import { ORDER_TYPES } from "../../../types/types";

export default function YourPosition() {
  const kogenClient = useKogenQueryClient();
  const address = useGetAddress();

  const lockedAmount = useKogenMarketsLockedAmountQuery({
    client: kogenClient,
    args: {
      owner: address || "",
    },
    options: {
      enabled: Boolean(address),
      staleTime: 10000,
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

  const position_in_base = useGetPosition();
  const hasPosition = !position_in_base.eq(0);
  const [, setOpenOrderType] = useRecoilState(externalOpenOrderFormState);
  const closePosition = useCallback(() => {
    if (position_in_base.eq(0)) {
      return;
    }

    const oppositeOrderType = position_in_base.gt(0)
      ? ORDER_TYPES.ASK
      : ORDER_TYPES.BID;

    setOpenOrderType({
      type: oppositeOrderType,
      size: toUserToken(position_in_base, config.data?.base_decimals).abs(),
    });
  }, [position_in_base, setOpenOrderType, config]);

  return (
    <Fragment>
      <Typography variant="caption">Your position</Typography>

      <TableContainer component={Box}>
        <Table sx={{ width: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="center">
                Locked balance
              </TableCell>
              <TableCell align="center">CALL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">
                {toUserToken(
                  lockedAmount.data?.locked_base_denom || "0",
                  config.data?.base_decimals,
                ).toFixed(3)}{" "}
                {config.data?.base_symbol}
              </TableCell>
              <TableCell align="center">
                {toUserToken(
                  lockedAmount.data?.locked_quote_denom || "0",
                  config.data?.quote_decimals,
                ).toFixed(3)}{" "}
                {config.data?.quote_symbol}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={toUserToken(
                    position_in_base,
                    config.data?.base_decimals,
                  ).toFixed(3)}
                  variant="outlined"
                  color={
                    position_in_base.lessThan(0)
                      ? "primary"
                      : position_in_base.equals(0)
                      ? "default"
                      : "secondary"
                  }
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      {hasPosition && (
        <Grid container justifyContent={"flex-end"} sx={{ mt: 2 }}>
          <Grid item xs={12} md="auto">
            <Button
              fullWidth
              variant="text"
              size="small"
              color={position_in_base.lt(0) ? "secondary" : "primary"}
              onClick={closePosition}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
}
