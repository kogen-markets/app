import { useChain } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import { Fragment } from "react";
import { Button } from "@mui/material";
import { addressShort } from "../lib/token";

export default function WalletButton() {
  const chain = useRecoilValue(chainState);
  const {
    address,
    username,
    connect,
    disconnect,
    wallet,
    chainWallet,
    isWalletConnected,
    getSigningCosmWasmClient,
  } = useChain(chain.chain_name);

  if (!isWalletConnected) {
    return (
      <Fragment>
        <Button color="secondary" variant="outlined" href="" onClick={connect}>
          CONNECT
        </Button>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Button color="secondary" variant="outlined" href="" onClick={disconnect}>
        {wallet?.prettyName} - {addressShort(address || "")}
      </Button>
    </Fragment>
  );
}
