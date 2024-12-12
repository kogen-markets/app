import { Typography } from "@mui/material";
import WithValue from "../../../../components/with-value";
import { Config } from "../../../../codegen/KogenMarkets.types";

export default function Expiry({ config }: { config: Config }) {
  const calculateCorrectedExpiry = (expiry: string) => {
    const expiryDate = new Date(parseInt(expiry) / 1000000);

    if (isNaN(expiryDate.getTime())) {
      console.error("Invalid expiry date", expiry);
      return new Date();
    }

    if (expiryDate.getUTCHours() === 0 && expiryDate.getUTCMinutes() === 30) {
      expiryDate.setUTCDate(expiryDate.getUTCDate() + 1);
    }

    return expiryDate;
  };

  const formattedExpiry = calculateCorrectedExpiry(
    config.expiry
  ).toLocaleString("en-GB", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });

  return (
    <WithValue value={config.expiry}>
      <Typography variant="caption">Expiry</Typography>
      <Typography variant="body1">{formattedExpiry}</Typography>
    </WithValue>
  );
}
