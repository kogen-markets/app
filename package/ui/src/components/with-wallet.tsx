import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import { useChain } from "@cosmos-kit/react-lite";
import { Fragment } from "react";
import WalletButton from "./wallet-button";
import { ButtonProps } from "@mui/material";
import { metamaskAddressState } from "../state/injective";

export default function WithWallet({
  children,
  WalletButtonProps,
}: {
  children?: React.ReactNode;
  WalletButtonProps?: ButtonProps;
}) {
  const chain = useRecoilValue(chainState);
  const { isWalletConnected } = useChain(chain.chain_name);
  const metamaskAddress = useRecoilValue(metamaskAddressState);

  if (!isWalletConnected && !metamaskAddress) {
    return <WalletButton ButtonProps={WalletButtonProps} />;
  } else {
    return <Fragment>{children}</Fragment>;
  }
}
