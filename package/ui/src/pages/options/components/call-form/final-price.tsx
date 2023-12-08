import { Tooltip, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Fragment, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { openOrderFormState } from "../../../../state/kogen";
import { getCollateralSize } from "../../../../lib/token";
import { ORDER_TYPES } from "../../../../types/types";
import useGetPosition from "../../../../hooks/use-get-position";
import { Config } from "../../../../codegen/KogenMarkets.types";
import Decimal from "decimal.js";

export default function PriceAndCollateral({
  config,
  isCall,
}: {
  config: Config;
  isCall: boolean;
}) {
  const formState = useRecoilValue(openOrderFormState);

  const { positionInUserRelativeToTheType } = useGetPosition();

  const collateral = useMemo(() => {
    return getCollateralSize(
      isCall,
      formState.type,
      config,
      formState.optionSize,
      formState.optionPrice,
      positionInUserRelativeToTheType,
    );
  }, [isCall, formState, config, positionInUserRelativeToTheType]);

  const isBid = useMemo(() => formState.type === ORDER_TYPES.BID, [formState]);

  return (
    <Fragment>
      <Typography
        variant="body1"
        sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        You need to deposit {collateral?.amount?.toPrecision(4)}{" "}
        {collateral?.symbol}
        {isBid && (
          <Tooltip
            enterTouchDelay={0}
            title={
              <Fragment>
                {collateral?.optionAmount && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <span>Option price:</span>
                    <span>
                      {collateral.optionAmount.toFixed(
                        config.quote_decimals -
                          new Decimal(config.min_tick_quote).log(10).toNumber(),
                      )}{" "}
                      {collateral?.symbol}
                    </span>
                  </Typography>
                )}{" "}
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <span>Collateral: </span>
                  <span>
                    {collateral?.strikeAmount.toFixed(
                      config.quote_decimals -
                        new Decimal(config.min_tick_quote).log(10).toNumber(),
                    )}{" "}
                    {collateral?.symbol}
                  </span>
                </Typography>
                {collateral?.closingSize.gt(0) && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <span>Closing {isBid ? "ask" : "bid"} position: </span>
                    <span>{collateral?.closingSize.toFixed(3)}</span>
                  </Typography>
                )}
              </Fragment>
            }
          >
            <HelpOutlineIcon fontSize="small" />
          </Tooltip>
        )}
      </Typography>
    </Fragment>
  );
}
