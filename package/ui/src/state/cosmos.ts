import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { atom, selector } from "recoil";
import { localStorageEffect, LOCAL_STORAGE_KEPLR_INTERACTED } from "./effects";

export const chainState = atom({
  key: "chainState",
  default: {
    chainId: "injective-888",
  },
});

export const keplrInteractedState = atom({
  key: "keplrInteractedState",
  default: false,
  effects: [localStorageEffect(LOCAL_STORAGE_KEPLR_INTERACTED)],
});

export const keplrState = atom<{
  initialized: boolean;
  isInstalled: boolean;
  account: string | null;
  name: string | null;
}>({
  key: "keplrState",
  default: {
    initialized: false,
    isInstalled: false,
    account: null,
    name: null,
  },
});

export const injectiveKeplrState = selector({
  key: "injectiveKeplrState",
  get: async ({ get }) => {
    const keplr = get(keplrState);
    const chain = get(chainState);
    if (!keplr.account) {
      return null;
    }

    if (!window.getOfflineSigner || !window.keplr) {
      return null;
    }

    const offlineSigner = await window.getOfflineSigner(chain.chainId);
    const accounts = await offlineSigner.getAccounts();
    const key = await window.keplr.getKey(chain.chainId);

    return {
      offlineSigner,
      accounts,
      key,
    };
  },
});

export const rpcsState = selector<string[]>({
  key: "rpcsState",
  get: async ({ get }) => {
    const chain = get(chainState);
    if (chain.chainId === "injective-1") {
      return JSON.parse(import.meta.env.VITE_INJECTIVE_RPCS) as string[];
    }

    if (chain.chainId === "injective-888") {
      return JSON.parse(import.meta.env.VITE_INJECTIVE_RPCS) as string[];
    }

    throw new Error("unknown chainId " + chain.chainId);
  },
});

export const signClientState = selector<SigningCosmWasmClient | null>({
  key: "signClientState",
  dangerouslyAllowMutability: true,
  get: async ({ get }) => {
    const { SigningCosmWasmClient } = await import("@cosmjs/cosmwasm-stargate");
    const keplr = get(keplrState);

    if (!keplr.account) {
      return null;
    }

    if (!window.getOfflineSignerAuto) {
      return null;
    }

    const clientIx = get(clientIxState);
    const chain = get(chainState);
    const rpcs = get(rpcsState);
    const offlineSigner = await window.getOfflineSignerAuto(chain.chainId);
    for (let i = 0; i < rpcs.length; i++) {
      try {
        const client = await SigningCosmWasmClient.connectWithSigner(
          rpcs[(clientIx + i) % rpcs.length],
          offlineSigner
        );

        return client;
      } catch (e) {
        // connect error, try next client
      }
    }

    return null;
  },
});

export const clientState = selector<CosmWasmClient>({
  key: "clientState",
  dangerouslyAllowMutability: true,
  get: async ({ get }) => {
    const { CosmWasmClient } = await import("@cosmjs/cosmwasm-stargate");

    const clientIx = get(clientIxState);
    const rpcs = get(rpcsState);
    for (let i = 0; i < rpcs.length; i++) {
      try {
        const client = await CosmWasmClient.connect(
          rpcs[(clientIx + i) % rpcs.length]
        );

        return client;
      } catch (e) {
        // connect error, try next client
      }
    }

    throw new Error("no rpc client");
  },
});

export const clientIxState = atom<number>({
  key: "clientIxState",
  default: 0,
});
