import { useChain } from "@cosmos-kit/react-lite";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, ButtonProps } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { chainState } from "../state/cosmos";
import { Fragment } from "react";
import { addressShort } from "../lib/token";
import {
  metamaskAddressState,
  metamaskWalletStrategyState,
} from "../state/injective";

export default function WalletButton({
  ButtonProps,
}: {
  ButtonProps?: ButtonProps;
}) {
  const chain = useRecoilValue(chainState);
  const { address, connect, disconnect, wallet, isWalletConnected } = useChain(
    chain.chain_name,
  );

  const [metamaskWalletStrategy, setMetamaskWalletStrategy] = useRecoilState(
    metamaskWalletStrategyState,
  );
  const metamaskAddress = useRecoilValue(metamaskAddressState);

  if (!isWalletConnected && !metamaskAddress) {
    return (
      <Fragment>
        <Button
          color="secondary"
          variant="outlined"
          href=""
          onClick={connect}
          {...ButtonProps}
        >
          Connect wallet
        </Button>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Button
        color="secondary"
        variant="outlined"
        href=""
        disabled
        {...ButtonProps}
      >
        {wallet?.prettyName || "Metamask"} -{" "}
        {addressShort(address || metamaskAddress?.injective || "")}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        href=""
        onClick={
          metamaskWalletStrategy
            ? () => setMetamaskWalletStrategy(null)
            : disconnect
        }
      >
        <LogoutIcon />
      </Button>
    </Fragment>
  );
}
