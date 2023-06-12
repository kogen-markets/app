import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
import { WalletStrategy } from "@injectivelabs/wallet-ts";
import { atom, selector } from "recoil";

export const metamaskWalletStrategyState = atom<null | WalletStrategy>({
  key: "metamaskWalletStrategyState",
  dangerouslyAllowMutability: true,
  default: null,
});

export const metamaskAddressState = selector<
  | undefined
  | null
  | {
      injective: string;
      ethereum: string;
    }
>({
  key: "metamaskAddressState",
  get: async ({ get }) => {
    const metamaskWalletStrategy = get(metamaskWalletStrategyState);
    if (!metamaskWalletStrategy) {
      return null;
    }
    try {
      const address = (await metamaskWalletStrategy.getAddresses())[0];

      return {
        ethereum: address,
        injective: getInjectiveAddress(address),
      };
    } catch (e) {
      return undefined;
    }
  },
});
