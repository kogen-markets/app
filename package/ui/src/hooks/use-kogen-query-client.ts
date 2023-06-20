import { useRecoilValue } from "recoil";
import { KogenMarketsQueryClient } from "../codegen/KogenMarkets.client";
import { contractsState } from "../state/kogen";
import useJunoQueryClient from "./use-query-client";

export default function useKogenQueryClient() {
  const contract = useRecoilValue(contractsState);

  const junoClient = useJunoQueryClient();

  return new KogenMarketsQueryClient(junoClient, contract);
}
