import { useChain } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { chainState } from "../state/cosmos";
import { Fragment } from "react";
import { addressShort } from "../lib/token";

export default function WalletButton() {
  const chain = useRecoilValue(chainState);
  const { address, connect, disconnect, wallet, isWalletConnected } = useChain(
    chain.chain_name
  );

  if (!isWalletConnected) {
    return (
      <Fragment>
        <Button color="secondary" variant="outlined" href="" onClick={connect}>
          Connect wallet
        </Button>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Button color="secondary" variant="outlined" href="" disabled>
        {wallet?.prettyName} - {addressShort(address || "")}
      </Button>
      <Button color="secondary" variant="outlined" href="" onClick={disconnect}>
        <LogoutIcon />
      </Button>
    </Fragment>
  );
}
