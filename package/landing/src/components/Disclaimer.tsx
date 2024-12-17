import { Alert } from "@mui/material";
import disclaimerText from "./Disclaimer.txt?raw";

const Disclaimer = () => {
  return (
    <Alert
      severity="warning"
      variant="outlined"
      sx={{ backdropFilter: "blur(5px)" }}
    >
      {disclaimerText}
    </Alert>
  );
};

export default Disclaimer;
