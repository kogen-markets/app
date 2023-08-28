import { useRecoilValue } from "recoil";
import { KogenMarketsQueryClient } from "../codegen/KogenMarkets.client";
import { contractsState } from "../state/kogen";
import useCosmWasmQueryClient from "./use-query-client";

export default function useKogenQueryClient() {
  const contract = useRecoilValue(contractsState);

  const cosmWasmQueryClient = useCosmWasmQueryClient();

  return new KogenMarketsQueryClient(cosmWasmQueryClient, contract);
}
