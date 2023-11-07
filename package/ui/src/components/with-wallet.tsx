import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import { useChain } from "@cosmos-kit/react-lite";
import { Fragment } from "react";
import WalletButton from "./wallet-button";
import { ButtonProps } from "@mui/material";
import { metamaskAddressState } from "../state/injective";

export function WithWallet({ children }: { children: React.ReactNode[] }) {
  const chain = useRecoilValue(chainState);
  const { isWalletConnected } = useChain(chain.chain_name);
  const metamaskAddress = useRecoilValue(metamaskAddressState);

  if (!isWalletConnected && !metamaskAddress) {
    return children[1];
  } else {
    return <Fragment>{children[0]}</Fragment>;
  }
}

export default function WithWalletConnect({
  children,
  WalletButtonProps,
}: {
  children?: React.ReactNode;
  WalletButtonProps?: ButtonProps;
}) {
  return (
    <WithWallet>
      {[
        children,
        <WalletButton key="wallet-button" ButtonProps={WalletButtonProps} />,
      ]}
    </WithWallet>
  );
}
