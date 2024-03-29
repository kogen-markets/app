import {
  Box,
  Button,
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
import { openOrderFormState } from "../../../state/kogen";
import { ORDER_TYPES } from "../../../types/types";
import {
  GLOBAL_CUSTOM_EVENTS,
  dispatch,
} from "../../../hooks/use-event-listener";

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

  const {
    positionInBase,
    positionInBaseWithoutCollateralClosing,
    positionInBaseOnlyCollateralClosing,
  } = useGetPosition();
  const hasPosition = !positionInBase.eq(0);
  const [, setFormState] = useRecoilState(openOrderFormState);

  const closePosition = useCallback(() => {
    if (positionInBase.eq(0)) {
      return;
    }

    const oppositeOrderType = positionInBase.gt(0)
      ? ORDER_TYPES.ASK
      : ORDER_TYPES.BID;

    setFormState((x) => ({
      ...x,
      type: oppositeOrderType,
      optionSize: toUserToken(positionInBase, config.data?.base_decimals)
        .abs()
        .toNumber(),
    }));

    dispatch(GLOBAL_CUSTOM_EVENTS.SCROLL_CALL_FORM_INTO_VIEW);
  }, [positionInBase, setFormState, config]);

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
              <TableCell align="center"></TableCell>
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
                    positionInBaseWithoutCollateralClosing,
                    config.data?.base_decimals,
                  ).toFixed(3)}
                  variant="outlined"
                  color={
                    positionInBaseWithoutCollateralClosing.lessThan(0)
                      ? "primary"
                      : positionInBaseWithoutCollateralClosing.equals(0)
                        ? "default"
                        : "secondary"
                  }
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </TableCell>
              <TableCell align="center" width="1px">
                {hasPosition && (
                  <Button
                    fullWidth
                    variant="text"
                    size="small"
                    color={positionInBase.lt(0) ? "primary" : "secondary"}
                    onClick={closePosition}
                  >
                    Close
                  </Button>
                )}
                {!positionInBaseOnlyCollateralClosing.eq(0) && (
                  <Typography variant="caption">
                    {toUserToken(
                      positionInBaseOnlyCollateralClosing,
                      config.data?.base_decimals,
                    ).toFixed(3)}{" "}
                    used as collateral
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
    </Fragment>
  );
}
