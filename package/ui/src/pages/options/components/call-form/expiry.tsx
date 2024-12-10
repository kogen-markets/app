import { Typography } from "@mui/material";
import WithValue from "../../../../components/with-value";

export default function Expiry({ expiryDate }: { expiryDate: Date | null }) {
  if (!expiryDate) {
    return <Typography variant="body1">No expiry date set</Typography>;
  }

  const formattedExpiryDate = expiryDate.toLocaleString("en-GB", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });

  return (
    <WithValue value={formattedExpiryDate}>
      <Typography variant="caption">Expiry</Typography>
      <Typography variant="body1">{formattedExpiryDate}</Typography>
    </WithValue>
  );
}
