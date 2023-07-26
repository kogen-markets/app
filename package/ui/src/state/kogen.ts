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
      return "inj13huyugghzkcjk48ugy48rkvmxav9326sv723nu";
    }
    if (chain.chain_id === TESTNET.NEUTRON) {
      return "neutron1w7jvt6nt0d79nwpzt32w32qss0cnlt20naevljmx70nhathe5sfqh23tmq";
    }
    if (chain.chain_id === TESTNET.ARCHWAY) {
      return "archway1s6u9dtt06s780sy7s2d5c7ry9x76rkf7ztew9d24u9wdg49c4fwqvdtyv3";
    }

    throw new Error("unknown chain_id " + chain.chain_id);
  },
});
