import { useRecoilValue } from "recoil";
import { factoryContractState } from "../state/kogen";
import useCosmWasmQueryClient from "./use-query-client";
import { KogenFactoryQueryClient } from "../codegen/KogenFactory.client";

export default function useKogenFactoryQueryClient() {
  const address = useRecoilValue(factoryContractState);

  const cosmWasmQueryClient = useCosmWasmQueryClient();

  return new KogenFactoryQueryClient(cosmWasmQueryClient, address);
}
