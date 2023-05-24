import {
  ChainRestAuthApi,
  ChainRestTendermintApi,
} from "@injectivelabs/sdk-ts";
import { atom } from "recoil";

const restEndpoint = import.meta.env.VITE_INJECTIVE_REST_ENDPOINT as string;

export const injectiveState = atom({
  key: "injectiveState",
  default: {
    chainId: "injective-1",
    chainRestAuthApi: new ChainRestAuthApi(restEndpoint),
    chainRestTendermintApi: new ChainRestTendermintApi(restEndpoint),
  },
});
