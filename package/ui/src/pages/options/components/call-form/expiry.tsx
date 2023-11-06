import { Typography } from "@mui/material";
import WithValue from "../../../../components/with-value";
import { Config } from "../../../../codegen/KogenMarkets.types";

export default function Expiry({ config }: { config: Config }) {
  return (
    <WithValue value={config.expiry}>
      <Typography variant="caption">Expiry</Typography>
      <Typography variant="body1">
        {new Date(parseInt(config.expiry) / 1000000).toLocaleDateString(
          undefined,
          {
            month: "long",
            day: "2-digit",
            year: "numeric",
          },
        )}
      </Typography>
    </WithValue>
  );
}
