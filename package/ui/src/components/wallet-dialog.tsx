import { WalletModalProps } from "@cosmos-kit/core";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { Wallet, WalletStrategy } from "@injectivelabs/wallet-ts";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { useRecoilState, useRecoilValue } from "recoil";

import { chainState } from "../state/cosmos";
import { TESTNET } from "../lib/config";
import { metamaskWalletStrategyState } from "../state/injective";

export default function WalletDialog({
  isOpen,
  setOpen,
  walletRepo,
}: WalletModalProps) {
  function onCloseModal() {
    setOpen(false);
  }

  const chain = useRecoilValue(chainState);
  const [, setMetamaskWalletStrategy] = useRecoilState(
    metamaskWalletStrategyState
  );

  return (
    <Dialog onClose={onCloseModal} open={isOpen} disableScrollLock={true}>
      <DialogTitle>Select Wallet</DialogTitle>
      {walletRepo?.wallets.map(({ walletName, connect, walletPrettyName }) => (
        <Button
          key={walletName}
          onClick={async () => {
            setMetamaskWalletStrategy(null);
            await connect();
            setOpen(false);
          }}
        >
          {walletPrettyName}
        </Button>
      ))}
      {chain.chain_id === TESTNET.INJECTIVE && (
        <Button
          onClick={async () => {
            setOpen(false);
            setMetamaskWalletStrategy(
              new WalletStrategy({
                chainId: chain.chain_id as ChainId,
                wallet: Wallet.Metamask,
                ethereumOptions: {
                  ethereumChainId: EthereumChainId.Goerli,
                  rpcUrl: `https://eth-goerli.g.alchemy.com/v2/${
                    import.meta.env.VITE_ALCHEMY_PUBKEY
                  }`,
                },
              })
            );
          }}
        >
          Metamask
        </Button>
      )}
    </Dialog>
  );
}
