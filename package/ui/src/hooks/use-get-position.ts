import { useMemo } from "react";
import { Decimal } from "decimal.js";
import { useRecoilValue } from "recoil";
import useGetAddress from "./use-get-address";
import {
  useKogenMarketsConfigQuery,
  useKogenMarketsPositionQuery,
} from "../codegen/KogenMarkets.react-query";
import useKogenQueryClient from "./use-kogen-query-client";
import { openOrderFormState } from "../state/kogen";
import { toUserToken } from "../lib/token";
import { ORDER_TYPES } from "../types/types";

export default function useGetPosition() {
  const kogenClient = useKogenQueryClient();
  const address = useGetAddress();

  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
      suspense: true,
    },
  });

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

  const formState = useRecoilValue(openOrderFormState);

  const positionInBase = useMemo(() => {
    if (!position.data) {
      return new Decimal(0);
    }

    return new Decimal(position.data?.bid_position_in_base || 0).sub(
      position.data?.ask_position_in_base || 0,
    );
  }, [position]);

  const positionInUser = useMemo(
    () => toUserToken(positionInBase, config.data?.base_decimals),
    [positionInBase, config],
  );
  const positionInUserRelativeToTheType = useMemo(() => {
    if (
      (positionInUser.lt(0) && formState.type === ORDER_TYPES.BID) ||
      (positionInUser.gt(0) && formState.type === ORDER_TYPES.ASK)
    ) {
      return positionInUser.abs();
    }

    return new Decimal(0);
  }, [positionInUser, formState]);

  return {
    positionInBase,
    positionInUser,
    positionInUserRelativeToTheType,
  };
}
