import { useQuery } from "@tanstack/react-query";
import useQueryClient from "./use-query-client";
import useGetAddress from "./use-get-address";

export default function useGetBalance(addr?: string, denom?: string) {
  const client = useQueryClient();
  const walletAddr = useGetAddress();

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
      staleTime: 10000,
      suspense: true,
    },
  );
}
