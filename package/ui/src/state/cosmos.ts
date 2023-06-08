import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
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

export const chainState = atom<Chain>({
  key: "chainState",
  default: chains.find((c) => c.chain_id === TESTNET.INJECTIVE),
});

export const keplrInteractedState = atom({
  key: "keplrInteractedState",
  default: false,
  effects: [localStorageEffect(LOCAL_STORAGE_KEPLR_INTERACTED)],
});

export const rpcsState = selector<string[]>({
  key: "rpcsState",
  get: async ({ get }) => {
    const chain = get(chainState);
    if (
      [TESTNET.INJECTIVE, MAINNET.INJECTIVE].includes(chain.chain_id as any)
    ) {
      return JSON.parse(import.meta.env.VITE_INJECTIVE_RPCS) as string[];
    }

    if (chain.chain_id === TESTNET.NEUTRON) {
      return JSON.parse(import.meta.env.VITE_NEUTRON_RPCS) as string[];
    }

    if (chain.chain_id === TESTNET.ARCHWAY) {
      return JSON.parse(import.meta.env.VITE_ARCHWAY_RPCS) as string[];
    }

    throw new Error("unknown chain_id " + chain.chain_id);
  },
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
