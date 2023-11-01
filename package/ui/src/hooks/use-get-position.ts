import { useMemo } from "react";
import { Decimal } from "decimal.js";
import useGetAddress from "./use-get-address";
import { useKogenMarketsPositionQuery } from "../codegen/KogenMarkets.react-query";
import useKogenQueryClient from "./use-kogen-query-client";

export default function useGetPosition() {
  const kogenClient = useKogenQueryClient();
  const address = useGetAddress();

  const position = useKogenMarketsPositionQuery({
    client: kogenClient,
    args: {
      owner: address || "",
    },
    options: {
      enabled: Boolean(address),
      staleTime: 10000,
      suspense: true,
    },
  });

  const position_in_base = useMemo(() => {
    if (!position.data) {
      return new Decimal(0);
    }

    return new Decimal(position.data?.bid_position_in_base || 0).sub(
      position.data?.ask_position_in_base || 0,
    );
  }, [position]);

  return position_in_base;
}
