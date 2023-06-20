import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import { useQuery } from "@tanstack/react-query";
import { useChain } from "@cosmos-kit/react";
import { metamaskAddressState } from "../state/injective";
import useQueryClient from "./use-query-client";

export default function useGetBalance(addr?: string, denom?: string) {
  const client = useQueryClient();
  const chain = useRecoilValue(chainState);
  const { address: cosmosAddress } = useChain(chain.chain_name);
  const metamaskAddress = useRecoilValue(metamaskAddressState);
  const walletAddr = cosmosAddress || metamaskAddress?.injective;

  const checkAddr = walletAddr || addr;

  return useQuery(
    ["get_balance", checkAddr, denom],
    async () => {
      if (!checkAddr || !denom) {
        return null;
      }

      const coin = await client.getBalance(checkAddr, denom);

      return coin;
    },
    {
      enabled: Boolean(client),
      staleTime: 3000000,
      suspense: true,
    }
  );
}
