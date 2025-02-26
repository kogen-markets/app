import { atom, selector } from "recoil";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

export const seiWalletStrategyState = atom<DirectSecp256k1HdWallet | null>({
  key: "seiWalletState",
  dangerouslyAllowMutability: true,
  default: null,
});

export const seiAddressState = selector<
  | undefined
  | null
  | {
      sei: string;
    }
>({
  key: "seiAddressState",
  get: async ({ get }) => {
    const seiWallet = get(seiWalletStrategyState);
    if (!seiWallet) {
      return null;
    }
    try {
      const accounts = await seiWallet.getAccounts();
      return {
        sei: accounts[0].address,
      };
    } catch (e) {
      console.error("Error retrieving Sei address:", e);
      return undefined;
    }
  },
});
