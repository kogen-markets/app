import { atom, selector } from "recoil";
import { localStorageEffect, LOCAL_STORAGE_DARK_MODE } from "./effects";
import { KogenMarketsQueryClient } from "../codegen/KogenMarkets.client";
import { chainState, clientState } from "./cosmos";
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
      return "inj14ur9w8ltfex99mu5mu7rx34w7ntskzjt9h78pw";
    }
    if (chain.chain_id === TESTNET.NEUTRON) {
      return "neutron1erpdvnmkfpcansg28r5cwhaezs0an2f9ec8h2894dhe2wzddm6vskx9f8k";
    }
    if (chain.chain_id === TESTNET.ARCHWAY) {
      return "archway1lt5ufw8fdhp4kaguxrmrwukk2xv4kyvh3c53wmua675ptn87848q24clum";
    }

    throw new Error("unknown chain_id " + chain.chain_id);
  },
});

export const kogenMarketsQueryClientState = selector<KogenMarketsQueryClient>({
  key: "kogenMarketsQueryClientState",
  get: async ({ get }) => {
    const contracts = get(contractsState);
    const client = get(clientState);

    return new KogenMarketsQueryClient(client, contracts);
  },
});
