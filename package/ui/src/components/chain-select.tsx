import { FormControl, MenuItem, Select } from "@mui/material";
import { Fragment } from "react";
import { useRecoilState } from "recoil";
import { chainState } from "../state/cosmos";

export default function ChainSelect() {
  const [chain, setChain] = useRecoilState(chainState);
  return (
    <Fragment>
      <FormControl>
        <Select
          MenuProps={{ disableScrollLock: true }}
          size="small"
          value={chain.chainId}
          onChange={(event) =>
            setChain((chain) => {
              return { ...chain, chainId: event.target.value };
            })
          }
        >
          <MenuItem value={"injective-888"}>Injective (Testnet)</MenuItem>
          <MenuItem value={"pion-1"}>Neutron (Testnet)</MenuItem>
        </Select>
      </FormControl>
    </Fragment>
  );
}
