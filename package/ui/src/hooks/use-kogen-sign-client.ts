import { useRecoilValue } from "recoil";
import { KogenMarketsClient } from "../codegen/KogenMarkets.client";
import { contractsState } from "../state/kogen";
import useJunoSignClient from "./use-sign-client";
import { useChain } from "@cosmos-kit/react";
import { chainState } from "../state/cosmos";

export default function useKogenSignClient() {
  const contract = useRecoilValue(contractsState);
  const chain = useRecoilValue(chainState);
  const { address } = useChain(chain.chain_name);

  const junoSignClient = useJunoSignClient();

  if (!junoSignClient || !address) {
    return null;
  }

  return new KogenMarketsClient(junoSignClient, address, contract);
}
