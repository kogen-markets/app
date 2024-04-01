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

const [, setSnackbar] = useRecoilState(snackbarState);

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
        onClick={(e) => {
          e.preventDefault(); // Prevent default action if it's a link

          if (metamaskWalletStrategy) {
            setMetamaskWalletStrategy(null);
          } else {
            // Calling disconnect with options
            disconnect().then(() => {
              // Informs the user that the disconnect was successful
              setSnackbar({ message: "Disconnected successfully", type: "success" });
            }).catch((error) => {
              // Logging the error to the user using the snackbar
              console.error(error); // Also log to console for debugging
              setSnackbar({ message: "An error occurred. Please try again.", type: "error" });
            });
          }
        }}
      >
        <LogoutIcon />
      </Button>
    </Fragment>
  );
}
