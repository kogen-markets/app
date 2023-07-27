import { atom, selector } from "recoil";
import { localStorageEffect, LOCAL_STORAGE_DARK_MODE } from "./effects";
import { chainState } from "./cosmos";
import { TESTNET } from "../lib/config";

export const densInitializedState = atom({
  key: "densInitializedState",
  default: false,
});

export const drawerOpenedState = atom({
  key: "drawerOpenedState",
  default: false,
});

export const darkModeState = atom<"dark" | "light" | "auto">({
  key: "darkModeState",
  default: "dark",
  effects: [localStorageEffect(LOCAL_STORAGE_DARK_MODE)],
});

export const contractsState = selector<string>({
  key: "contractsState",
  get: async ({ get }) => {
    const chain = get(chainState);
    if (chain.chain_id === TESTNET.INJECTIVE) {
      return import.meta.env.VITE_CONTRACT_INJECTIVE_TESTNET;
    }
    if (chain.chain_id === TESTNET.NEUTRON) {
      return import.meta.env.VITE_CONTRACT_NEUTRON_TESTNET;
    }
    if (chain.chain_id === TESTNET.ARCHWAY) {
      return import.meta.env.VITE_CONTRACT_ARCHWAY_TESTNET;
    }

    throw new Error("unknown chain_id " + chain.chain_id);
  },
});
