import React, { useCallback, useEffect } from "react";
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
import { snackbarState } from "../state/snackbar";
import CloseIcon from "@mui/icons-material/Close";

const walletIcons: { [key: string]: string } = {
  Keplr: "/icons/wallet-icons/keplr-icon.png",
  Leap: "/icons/wallet-icons/leap-icon.svg",
  MetaMask: "/icons/wallet-icons/metamask-icon.svg",
};

const WalletDialog: React.FC<WalletModalProps> = ({
  isOpen,
  setOpen,
  walletRepo,
}) => {
  const onCloseModal = useCallback(() => setOpen(false), [setOpen]);

  const chain = useRecoilValue(chainState);
  const [, setMetamaskWalletStrategy] = useRecoilState(
    metamaskWalletStrategyState
  );
  const [, setSnackbar] = useRecoilState(snackbarState);

  useEffect(() => {
    if (walletRepo && walletRepo.wallets.length === 0) {
      setSnackbar({
        message: "No wallets available. Please try again later.",
        type: "error",
      });
    }
  }, [walletRepo, setSnackbar]);

  const handleConnect = async (
    walletName: string,
    connect: () => Promise<void>
  ) => {
    try {
      console.log(`Connecting to wallet: ${walletName}`);
      await connect();
      setSnackbar({
        message: `${walletName} connected successfully!`,
        type: "success",
      });
      setOpen(false);
    } catch (error) {
      console.error(`Failed to connect with ${walletName}:`, error);
      setSnackbar({
        message: `Failed to connect to ${walletName}. Please try again.`,
        type: "error",
      });
    }
  };

  const handleMetaMaskConnect = async () => {
    try {
      setOpen(false);

      if (window.ethereum?.request) {
        const strategy = new WalletStrategy({
          chainId: chain.chain_id as ChainId,
          wallet: Wallet.Metamask,
          ethereumOptions: {
            ethereumChainId: EthereumChainId.Goerli,
            rpcUrl: `https://eth-goerli.g.alchemy.com/v2/${
              import.meta.env.VITE_ALCHEMY_PUBKEY
            }`,
          },
        });

        setMetamaskWalletStrategy(strategy);
        setSnackbar({
          message: "MetaMask connected successfully!",
          type: "success",
        });
      } else {
        console.error("MetaMask is not installed or request is unavailable");
        setSnackbar({
          message:
            "MetaMask is not installed or unavailable. Please install MetaMask.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to connect with MetaMask:", error);
      setSnackbar({
        message:
          error instanceof Error
            ? error.message
            : "MetaMask connection failed. Please try again.",
        type: "error",
      });
    }
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
