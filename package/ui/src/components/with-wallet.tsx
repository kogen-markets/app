import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import { useChain } from "@cosmos-kit/react";
import { Fragment } from "react";
import WalletButton from "./wallet-button";
import { ButtonProps } from "@mui/material";

export default function WithWallet({
  children,
  WalletButtonProps,
}: {
  children?: React.ReactNode;
  WalletButtonProps?: ButtonProps;
}) {
  const chain = useRecoilValue(chainState);
  const { isWalletConnected } = useChain(chain.chain_name);

  if (!isWalletConnected) {
    return <WalletButton ButtonProps={WalletButtonProps} />;
  } else {
    return <Fragment>{children}</Fragment>;
  }
}
