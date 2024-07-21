import { Typography } from "@mui/material";
import WithValue from "../../../../components/with-value";
import { Config } from "../../../../codegen/KogenMarkets.types";

export default function Expiry({ config }: { config: Config }) {
  return (
    <WithValue value={config.expiry}>
      <Typography variant="caption">Expiry</Typography>
      <Typography variant="body1">
        {new Date(parseInt(config.expiry) / 1000000).toLocaleString('en-GB', {
          month: 'long',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC',
          timeZoneName: 'short',
        })}
      </Typography>
    </WithValue>
  );
}
