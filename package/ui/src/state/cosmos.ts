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

const CHAIN_RPC_URLS: Record<string, string> = {
  [TESTNET.SEI]: import.meta.env.VITE_SEI_RPC_URL,
  [TESTNET.INJECTIVE]: import.meta.env.VITE_INJECTIVE_RPC_URL,
  [TESTNET.NEUTRON]: import.meta.env.VITE_NEUTRON_RPC_URL,
  [TESTNET.ARCHWAY]: import.meta.env.VITE_ARCHWAY_RPC_URL,
};

export const getClient = async (chainId: string): Promise<CosmWasmClient> => {
  const RPC_URL = CHAIN_RPC_URLS[chainId];

  if (!RPC_URL) {
    throw new Error(`No RPC URL found for chain ID: ${chainId}`);
  }

  return await CosmWasmClient.connect(RPC_URL);
};
