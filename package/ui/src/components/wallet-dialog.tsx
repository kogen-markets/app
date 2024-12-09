import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  Avatar,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Wallet, WalletStrategy } from "@injectivelabs/wallet-ts";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { useRecoilState, useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import { TESTNET } from "../lib/config";
import { metamaskWalletStrategyState } from "../state/injective";
import { WalletModalProps } from "@cosmos-kit/core";
import CloseIcon from "@mui/icons-material/Close";

// Define the wallet icons mapping
const walletIcons: { [key: string]: string } = {
  Keplr: "/public/icons/wallet-icons/keplr-icon.png",
  Leap: "/public/icons/wallet-icons/leap-icon.svg",
  MetaMask: "/public/icons/wallet-icons/metamask-icon.svg",
};

const WalletDialog: React.FC<WalletModalProps> = ({
  isOpen,
  setOpen,
  walletRepo,
}) => {
  const onCloseModal = () => {
    setOpen(false);
  };

  const chain = useRecoilValue(chainState);
  const [, setMetamaskWalletStrategy] = useRecoilState(
    metamaskWalletStrategyState
  );

  const handleConnect = async (
    walletName: string,
    connect: () => Promise<void>
  ) => {
    await connect();
    setOpen(false);
  };

  const handleMetaMaskConnect = async () => {
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
  };

  return (
    <Dialog
      onClose={onCloseModal}
      open={isOpen}
      disableScrollLock={true}
      fullWidth={true}
      maxWidth="xs"
    >
      <DialogTitle>
        Select Wallet
        <IconButton
          edge="end"
          color="inherit"
          onClick={onCloseModal}
          aria-label="close"
          sx={{ position: "absolute", top: 8, right: 20 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Grid container direction="column" spacing={2} p={2}>
        {walletRepo?.wallets.map(
          ({ walletName, connect, walletPrettyName }) => (
            <Grid item xs={12} key={walletName}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                border="1px solid #ddd"
                borderRadius="8px"
                onClick={() => handleConnect(walletName, connect)}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={walletIcons[walletPrettyName] || ""}
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body1">{walletPrettyName}</Typography>
                </Box>
              </Box>
            </Grid>
          )
        )}

        {chain.chain_id === TESTNET.INJECTIVE && (
          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
              border="1px solid #ddd"
              borderRadius="8px"
              onClick={handleMetaMaskConnect}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <Box display="flex" alignItems="center">
                <Avatar src={walletIcons.MetaMask} sx={{ mr: 2 }} />
                <Typography variant="body1">MetaMask</Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Dialog>
  );
};

export default WalletDialog;
