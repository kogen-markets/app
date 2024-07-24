import { atom, selector } from "recoil";
import { localStorageEffect, LOCAL_STORAGE_DARK_MODE } from "./effects";
import { chainState } from "./cosmos";
import { TESTNET } from "../lib/config";
import { ORDER_TYPE, ORDER_TYPES } from "../types/types";
import { OptionType } from "../codegen/KogenFactory.types";

export const densInitializedState = atom({
  key: "densInitializedState",
  default: false,
});

export const drawerOpenedState = atom({
  key: "drawerOpenedState",
  default: false,
});

export type OpenOrderForm = {
  type: ORDER_TYPE;
  optionSize: number;
  optionPrice: number;
};

export const openOrderFormState = atom<OpenOrderForm>({
  key: "openOrderFormState",
  default: {
    type: ORDER_TYPES.BID,
    optionSize: 0.1,
    optionPrice: 10,
  },
});

export const isOpenOrderBid = selector<boolean>({
  key: "isOpenOrderBid",
  get: ({ get }) => {
    return get(openOrderFormState).type === ORDER_TYPES.BID;
  },
});

export const darkModeState = atom<"dark" | "light" | "auto">({
  key: "darkModeState",
  default: "dark",
  effects: [localStorageEffect(LOCAL_STORAGE_DARK_MODE)],
});

export const optionTypeState = atom<"put" | "call">({
  key: "optionTypeState",
  default: "call",
});

export const optionWeekState = atom<1| 2>({ // 2 = MAXWEEK global variable
  key: "optionWeekState",
  default: 1,
});


export const optionContractsAddrState = atom<
  Record<string, Record<OptionType, string[]>>
>({
  key: "optionContractsAddrState",
  default: {},
});

export const isCallOptionState = selector<boolean>({
  key: "isCallOptionState",
  get: async ({ get }) => {
    const callOptionType = get(optionTypeState);

    return callOptionType === "call";
  },
});

export const whichWeekOptionState = selector<number>({
  key: "whichWeekOptionState",
  get: async ({ get }) => {
    const optionWeek = get(optionWeekState);

    return optionWeek;
  },
});

export const contractsState = selector<string>({
  key: "contractsState",
  get: async ({ get }) => {
    const chain = get(chainState);
    const isCallOption = get(isCallOptionState);
    const contracts = get(optionContractsAddrState);
    const whichWeek = get(whichWeekOptionState);

    return contracts[chain.chain_id][isCallOption ? "call" : "put"].slice(
      whichWeek - 1,
    )[0];

    if (isCallOption) {
      if (chain.chain_id === TESTNET.INJECTIVE) {
        return import.meta.env.VITE_CONTRACT_INJECTIVE_TESTNET;
      }
      if (chain.chain_id === TESTNET.NEUTRON) {
        return import.meta.env.VITE_CONTRACT_NEUTRON_TESTNET;
      }
      if (chain.chain_id === TESTNET.ARCHWAY) {
        return import.meta.env.VITE_CONTRACT_ARCHWAY_TESTNET;
      }

      throw new Error(`unknown chain_id ${chain.chain_id} for the call option`);
    } else {
      if (chain.chain_id === TESTNET.INJECTIVE) {
        return import.meta.env.VITE_CONTRACT_PUT_INJECTIVE_TESTNET;
      }

      throw new Error(`unknown chain_id ${chain.chain_id} for the put option`);
    }
  },
});

async function fetchContractAddressInjective(): Promise<string> {
  const response = await fetch('https://raw.githubusercontent.com/kogen-markets/app/main/contract_addresses.json');
  const data = await response.json();
  return data.FACTORY_INJECTIVE_TESTNET;
}

export const factoryContractState = selector<string>({
  key: "factoryContractState",
  get: async ({ get }) => {
    const chain = get(chainState);

    if (chain.chain_id === TESTNET.INJECTIVE) {
      return import.meta.env.fetchContractAddressInjective();
    }

    throw new Error(`unknown chain_id ${chain.chain_id}`);
  },
});

export const contractBaseDenomsState = selector({
  key: "contractBaseDenomsState",
  get: ({ get }) => {
    const chain = get(chainState);

    if (chain.chain_id === TESTNET.INJECTIVE) {
      return [
        {
          symbol: "ATOM",
          denom: "factory/inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c/atom",
        },
      ];
    }

    throw new Error(`unknown chain_id ${chain.chain_id} for the base denoms`);
  },
});
