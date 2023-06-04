import { atom, atomFamily, selector } from "recoil";
import {
  localStorageEffect,
  LOCAL_STORAGE_SELECTED_DENS,
  LOCAL_STORAGE_DARK_MODE,
} from "./effects";
import { KogenMarketsQueryClient } from "../codegen/KogenMarkets.client";
import { chainState, clientState } from "./cosmos";

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
    if (chain.chainId === "injective-888") {
      return "inj1ykq3ch0z6h9k72s56ky9g3upy6z4pgp5wkk7e9";
    }

    throw new Error("unknown chainId " + chain.chainId);
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

export const selectedDensState = atomFamily<string | null, string | null>({
  key: "selectedDensState",
  default: () => null,
  effects: (account) => {
    if (!account) {
      return [];
    }

    const key = `${account}`;
    return [localStorageEffect(key, LOCAL_STORAGE_SELECTED_DENS)];
  },
});
