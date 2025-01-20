import React, { useEffect, Fragment } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, ButtonProps } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { chainState } from "../state/cosmos";
import { walletAddressState, prettyNameState } from "../state/walletState"; // Import the atoms
import { addressShort } from "../lib/token";
import { metamaskAddressState } from "../state/injective";
import { snackbarState } from "../state/snackbar";
import { useChain } from "@cosmos-kit/react-lite";

export default function WalletButton({
  ButtonProps,
}: {
  ButtonProps?: ButtonProps;
}) {
  const [, setSnackbar] = useRecoilState(snackbarState);
  const [, setWalletAddress] = useRecoilState(walletAddressState); // Recoil state for wallet address
  const [, setPrettyName] = useRecoilState(prettyNameState); // Recoil state for pretty name

  const chain = useRecoilValue(chainState);
  const { address, connect, disconnect, wallet, isWalletConnected } = useChain(
    chain.chain_name
  );
  const metamaskAddress = useRecoilValue(metamaskAddressState);

  useEffect(() => {
    if (address || metamaskAddress) {
      // Update the wallet address and pretty name in Recoil state
      setWalletAddress(address || metamaskAddress?.injective || "");
      setPrettyName(wallet?.prettyName || "Metamask");
    }
  }, [address, metamaskAddress, wallet, setWalletAddress, setPrettyName]);

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

          if (wallet) {
            handleDisconnect(); // Disconnect if wallet is connected
          }
        }}
      >
        <LogoutIcon />
      </Button>
    </Fragment>
  );
}
