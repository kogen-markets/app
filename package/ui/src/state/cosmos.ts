import { atom, selector } from "recoil";
import { localStorageEffect, LOCAL_STORAGE_KEPLR_INTERACTED } from "./effects";
import { chains } from "chain-registry";
import {
  ENABLED_MAINNETS,
  ENABLED_TESTNETS,
  MAINNET,
  TESTNET,
} from "../lib/config";

type Chain = (typeof chains)[0];

console.log(
  "Atlantic-2 Chain:",
  chains.find((chain) => chain.chain_id === "atlantic-2")
);
console.log(
  "TESTNET.SEI Chain:",
  chains.find((chain) => chain.chain_id === TESTNET.SEI)
);

export const chainState = atom<Chain>({
  key: "chainState",
  default: chains.find((c) => c.chain_id === TESTNET.SEI),
});

export const keplrInteractedState = atom({
  key: "keplrInteractedState",
  default: false,
  effects: [localStorageEffect(LOCAL_STORAGE_KEPLR_INTERACTED)],
});

export const pythServiceState = selector<URL>({
  key: "pythServiceState",
  get: async ({ get }) => {
    const chain = get(chainState);
    if (ENABLED_MAINNETS.includes(chain.chain_id as MAINNET)) {
      return new URL(
        "/api/latest_price_feeds",
        "https://xc-mainnet.pyth.network"
      );
    }

    if (ENABLED_TESTNETS.includes(chain.chain_id as TESTNET)) {
      return new URL(
        "/api/latest_price_feeds",
        "https://xc-testnet.pyth.network"
      );
    }

    throw new Error("unknown chain_id " + chain.chain_id);
  },
});
