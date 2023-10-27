import {
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useMemo } from "react";
import Decimal from "decimal.js";
import {
  useKogenMarketsLockedAmountQuery,
  useKogenMarketsPositionQuery,
  useKogenMarketsConfigQuery,
} from "../../../codegen/KogenMarkets.react-query";
import { toUserToken } from "../../../lib/token";
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";
import useGetAddress from "../../../hooks/use-get-address";

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

  const position = useKogenMarketsPositionQuery({
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

  const position_in_base = useMemo(() => {
    if (!position.data) {
      return new Decimal(0);
    }

    return new Decimal(position.data?.bid_position_in_base || 0).sub(
      position.data?.ask_position_in_base || 0,
    );
  }, [position]);

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
    </Fragment>
  );
}
