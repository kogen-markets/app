import { FormControl, FormControlProps, MenuItem, Select } from "@mui/material";
import { Fragment } from "react";
import { useRecoilState } from "recoil";
import { chains } from "chain-registry";
import { chainState } from "../state/cosmos";
import { TESTNET } from "../lib/config";

export default function ChainSelect({
  FormControlProps,
}: {
  FormControlProps?: FormControlProps;
}) {
  const [chain, setChain] = useRecoilState(chainState);

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
          value={chain.chain_id}
          onChange={(event) => {
            const chain = chains.find((c) => c.chain_id === event.target.value);

            if (!chain) {
              throw new Error("chain not found");
            }

            setChain(chain);
          }}
        >
          <MenuItem value={TESTNET.INJECTIVE}>Injective (Testnet)</MenuItem>
          <MenuItem value={TESTNET.NEUTRON}>Neutron (Testnet)</MenuItem>
        </Select>
      </FormControl>
    </Fragment>
  );
}
