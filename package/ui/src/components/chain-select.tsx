import { FormControl, FormControlProps, MenuItem, Select } from "@mui/material";
import { Fragment } from "react";

const INJECTIVE_URL =
  import.meta.env.VITE_INJECTIVE_URL || "https://app.injective.kogen.markets";
const SEI_URL = import.meta.env.VITE_SEI_URL || "https://app.sei.kogen.markets";

export default function ChainSelect({
  FormControlProps,
}: {
  FormControlProps?: FormControlProps;
}) {
  return (
    <Fragment>
      <FormControl {...FormControlProps}>
        <Select
          MenuProps={{
            disableScrollLock: true,
            color: "secondary",
            sx: {
              "&& .Mui-selected": (theme) => ({
                backgroundColor: theme.palette.secondary.main + " !important",
              }),
            },
          }}
          size="small"
          color="secondary"
          defaultValue="sei"
          onChange={(event) => {
            const selectedChain = event.target.value;

            if (selectedChain === "injective") {
              window.location.href = INJECTIVE_URL;
            } else if (selectedChain === "sei") {
              window.location.href = SEI_URL;
            }
          }}
        >
          <MenuItem value="injective">Injective (Testnet)</MenuItem>
          <MenuItem value="sei">SEI (Testnet)</MenuItem>
        </Select>
      </FormControl>
    </Fragment>
  );
}
