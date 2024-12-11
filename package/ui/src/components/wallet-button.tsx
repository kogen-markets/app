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
import { snackbarState } from "../state/snackbar";

export default function WalletButton({
  ButtonProps,
}: {
  ButtonProps?: ButtonProps;
}) {
  const [, setSnackbar] = useRecoilState(snackbarState);
  const chain = useRecoilValue(chainState);
  const { address, connect, disconnect, wallet, isWalletConnected } = useChain(
    chain.chain_name
  );

  const [metamaskWalletStrategy, setMetamaskWalletStrategy] = useRecoilState(
    metamaskWalletStrategyState
  );
  const metamaskAddress = useRecoilValue(metamaskAddressState);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setSnackbar({
        message: "Disconnected successfully",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

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
        onClick={(e) => {
          e.preventDefault(); // Prevent default action if it's a link

          if (metamaskWalletStrategy) {
            setMetamaskWalletStrategy(null);
          } else {
            handleDisconnect();
          }
        }}
      >
        <LogoutIcon />
      </Button>
    </Fragment>
  );
}
