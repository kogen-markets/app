import { Typography } from "@mui/material";
import { toUserToken } from "../../../../lib/token";
import WithValue from "../../../../components/with-value";
import { Config } from "../../../../codegen/KogenMarkets.types";

export default function StrikePrice({ config }: { config: Config }) {
  return (
    <WithValue value={config.strike_price_in_quote}>
      <Typography variant="caption">Strike</Typography>
      <Typography variant="body1">
        $
        {toUserToken(
          config.strike_price_in_quote,
          config.quote_decimals,
        ).toFixed(2)}
      </Typography>
    </WithValue>
  );
}
