import { WalletModalProps } from "@cosmos-kit/core";
import { Button, Dialog, DialogTitle } from "@mui/material";

export default function WalletDialog({
  isOpen,
  setOpen,
  walletRepo,
}: WalletModalProps) {
  function onCloseModal() {
    setOpen(false);
  }

  return (
    <Dialog onClose={onCloseModal} open={isOpen} disableScrollLock={true}>
      <DialogTitle>Select Wallet</DialogTitle>
      {walletRepo?.wallets.map(({ walletName, connect, walletPrettyName }) => (
        <Button
          key={walletName}
          onClick={async () => {
            await connect();
            setOpen(false);
          }}
        >
          {walletPrettyName}
        </Button>
      ))}
    </Dialog>
  );
}
