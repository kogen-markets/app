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
      return "inj1yax3plfpfzlzems9u6rqswse9cn5gt8whh0fxq";
    }
    if (chain.chain_id === TESTNET.NEUTRON) {
      return "neutron18anv85nnzrmjvgflkael4cyz3m3f52cwdc3jca96yauz3yn5h0wqmw6t64";
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
