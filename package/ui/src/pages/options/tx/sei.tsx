import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react-lite";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx.js";
import { toUtf8 } from "@cosmjs/encoding";

import { chainState } from "../../../state/cosmos";
import { ORDER_TYPE, ORDER_TYPES } from "../../../types/types";
import { contractsState } from "../../../state/kogen";
import useGetAddress from "../../../hooks/use-get-address";

export function useSeiCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { getSigningCosmWasmClient } = useChain(chain.chain_name);
  const address = useGetAddress();
  const contracts = useRecoilValue(contractsState);

  return useMutation(
    ["callOption"],
    async ({
      type,
      price,
      quantity,
      funds,
    }: {
      type: ORDER_TYPE;
      price: string;
      quantity: string;
      funds: {
        denom: string;
        amount: string;
      }[];
    }) => {
      if (!address) return null;

      const orderMsg = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
          contract: contracts,
          sender: address,
          msg: toUtf8(
            JSON.stringify({
              [`${type}_order`]: {
                price,
                quantity,
              },
            })
          ),
          funds: funds,
        }),
      };

      const signClient = await getSigningCosmWasmClient();
      return await signClient.signAndBroadcast(address, [orderMsg], "auto");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["asks"]);
        queryClient.invalidateQueries(["bids"]);
        queryClient.invalidateQueries(["locked_amount"]);
        queryClient.invalidateQueries(["position"]);
        queryClient.invalidateQueries(["get_balance", address]);
      },
    }
  );
}

export function useSeiClosePositionOrderMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { getSigningCosmWasmClient } = useChain(chain.chain_name);
  const address = useGetAddress();
  const contracts = useRecoilValue(contractsState);

  return useMutation(
    ["closePositionOrder"],
    async ({
      type,
      price,
      quantity,
      funds,
    }: {
      type: ORDER_TYPE;
      price: string;
      quantity: string;
      funds: {
        denom: string;
        amount: string;
      }[];
    }) => {
      if (!address) return null;

      const orderMsg = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
          contract: contracts,
          sender: address,
          msg: toUtf8(
            JSON.stringify({
              [type === ORDER_TYPES.ASK
                ? "close_long_position_order"
                : "close_short_position_order"]: {
                price,
                quantity,
              },
            })
          ),
          funds: funds,
        }),
      };

      const signClient = await getSigningCosmWasmClient();
      return await signClient.signAndBroadcast(address, [orderMsg], "auto");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["asks"]);
        queryClient.invalidateQueries(["bids"]);
        queryClient.invalidateQueries(["locked_amount"]);
        queryClient.invalidateQueries(["position"]);
        queryClient.invalidateQueries(["get_balance", address]);
      },
    }
  );
}

export function useSeiExerciseCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { getSigningCosmWasmClient } = useChain(chain.chain_name);
  const address = useGetAddress();
  const contracts = useRecoilValue(contractsState);

  return useMutation(
    ["exerciseCallOption"],
    async ({ expiry_price }: { expiry_price?: string }) => {
      if (!address) return null;

      const exerciseMsg = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
          contract: contracts,
          sender: address,
          msg: toUtf8(
            JSON.stringify({
              exercise_call_option: {
                expiry_price,
              },
            })
          ),
          funds: [],
        }),
      };

      const signClient = await getSigningCosmWasmClient();
      return await signClient.signAndBroadcast(address, [exerciseMsg], "auto");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["asks"]);
        queryClient.invalidateQueries(["bids"]);
        queryClient.invalidateQueries(["locked_amount"]);
        queryClient.invalidateQueries(["position"]);
        queryClient.invalidateQueries(["get_balance", address]);
      },
    }
  );
}

export function useSeiCancelOrderMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { getSigningCosmWasmClient } = useChain(chain.chain_name);
  const address = useGetAddress();
  const contracts = useRecoilValue(contractsState);

  return useMutation(
    ["cancelOrder"],
    async ({
      type,
      price,
      quantity,
    }: {
      type: ORDER_TYPE;
      price: string;
      quantity: string;
    }) => {
      if (!address) return null;

      const cancelOrderMsg = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
          contract: contracts,
          sender: address,
          msg: toUtf8(
            JSON.stringify({
              [`cancel_${type}_order`]: {
                price,
                quantity,
              },
            })
          ),
          funds: [],
        }),
      };

      const signClient = await getSigningCosmWasmClient();
      return await signClient.signAndBroadcast(
        address,
        [cancelOrderMsg],
        "auto"
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["asks"]);
        queryClient.invalidateQueries(["bids"]);
        queryClient.invalidateQueries(["locked_amount"]);
        queryClient.invalidateQueries(["position"]);
        queryClient.invalidateQueries(["get_balance", address]);
      },
    }
  );
}
