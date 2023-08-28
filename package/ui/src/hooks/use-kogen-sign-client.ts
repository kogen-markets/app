import { useRecoilValue } from "recoil";
import { KogenMarketsClient } from "../codegen/KogenMarkets.client";
import { contractsState } from "../state/kogen";
import useCosmWasmSignClient from "./use-sign-client";
import { useChain } from "@cosmos-kit/react-lite";
import { chainState } from "../state/cosmos";

export default function useKogenSignClient() {
  const contract = useRecoilValue(contractsState);
  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);

  const cosmWasmSignClient = useCosmWasmSignClient();

  if (!cosmWasmSignClient || !address) {
    return null;
  }

  return new KogenMarketsClient(cosmWasmSignClient, address, contract);
}
