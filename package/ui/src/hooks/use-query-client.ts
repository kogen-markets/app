import { useChain } from "@cosmos-kit/react-lite";
import { useRecoilValue } from "recoil";
import { suspend } from "suspend-react";

import { getClient, chainState } from "../state/cosmos";

export default function useQueryClient() {
  const chain = useRecoilValue(chainState);
  const { getCosmWasmClient } = useChain(chain.chain_name);

  return suspend(async () => {
    try {
      const client = await getClient(chain.chain_id);
      return client;
    } catch (error) {
      console.error("Error fetching query client:", error);
      throw error;
    }
  }, ["queryClient", chain.chain_name]);
}
