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
      return "inj1uzueryw54zc3p0vxr93hzgkfcpxkx2m0wp4jhl";
    }
    if (chain.chain_id === TESTNET.NEUTRON) {
      return "neutron17s0aysev3m9gd8t3dy27gs87chmlt2fc3j8dt7txw6s2jml5mwhstdgpc0";
    }
    if (chain.chain_id === TESTNET.ARCHWAY) {
      return "archway1ql8wsxkjr6zaxhdqr2qh47um4cjtk9s8fzt2p4vu0c226hz0qmpq6df78c";
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
