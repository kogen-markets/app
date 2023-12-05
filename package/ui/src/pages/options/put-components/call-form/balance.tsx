import { Typography } from "@mui/material";
import { Fragment, useMemo } from "react";
import { toUserToken } from "../../../../lib/token";
import { openOrderFormState } from "../../../../state/kogen";
import { useRecoilValue } from "recoil";
import { ORDER_TYPES } from "../../../../types/types";
import useGetBalance from "../../../../hooks/use-get-balance";
import { Config } from "../../../../codegen/KogenMarkets.types";

export default function Balance({ config }: { config: Config }) {
  const formState = useRecoilValue(openOrderFormState);
  // const isBid = useMemo(() => formState.type === ORDER_TYPES.BID, [formState]);
  const isBid = true;

  const balance = useGetBalance(
    undefined,
    isBid ? config.quote_denom : config.base_denom,
  );

  return (
    <Fragment>
      <Typography variant="caption">Available</Typography>
      {balance.data?.amount &&
        (isBid ? (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {toUserToken(balance.data.amount, config.quote_decimals).toFixed(2)}
            {config.quote_symbol}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {toUserToken(balance.data.amount, config.base_decimals).toFixed(2)}
            {config.base_symbol}
          </Typography>
        ))}
    </Fragment>
  );
}
