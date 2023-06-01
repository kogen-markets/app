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
import { Fragment } from "react";
import {
  useKogenMarketsLockedAmountQuery,
  useKogenMarketsPositionQuery,
} from "../../../codegen/KogenMarkets.react-query";
import { useRecoilValue } from "recoil";
import { kogenMarketsQueryClientState } from "../../../state/kogen";
import { toBaseToken } from "../../../lib/token";
import useTryNextClient from "../../../hooks/use-try-next-client";
import { keplrState } from "../../../state/cosmos";
import { useKogenMarketsConfigQuery } from "../../../codegen/KogenMarkets.react-query";

export default function YourPosition() {
  const kogenClient = useRecoilValue(kogenMarketsQueryClientState);
  const keplr = useRecoilValue(keplrState);
  const tryNextClient = useTryNextClient();
  const lockedAmount = useKogenMarketsLockedAmountQuery({
    client: kogenClient,
    args: {
      owner: keplr.account || "",
    },
    options: {
      enabled: Boolean(keplr.account),
      onError: tryNextClient,
      suspense: true,
    },
  });

  const position = useKogenMarketsPositionQuery({
    client: kogenClient,
    args: {
      owner: keplr.account || "",
    },
    options: {
      enabled: Boolean(keplr.account),
      onError: tryNextClient,
      suspense: true,
    },
  });

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
      <Typography variant="caption">Your position</Typography>

      <TableContainer component={Box}>
        <Table sx={{ width: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="center">
                Locked balance
              </TableCell>
              <TableCell align="right">CALL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">
                {toBaseToken(
                  lockedAmount.data?.locked_base_denom || "0",
                  config.data?.base_decimals
                )}{" "}
                ATOM
              </TableCell>
              <TableCell align="center">
                {toBaseToken(
                  lockedAmount.data?.locked_quote_denom || "0",
                  config.data?.quote_decimals
                )}{" "}
                USDT
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={toBaseToken(
                    position.data?.position_in_base || 0,
                    config.data?.base_decimals
                  )}
                  variant="outlined"
                  color={
                    (position.data?.position_in_base || 0) < 0
                      ? "primary"
                      : (position.data?.position_in_base || 0) === 0
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
