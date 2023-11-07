import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react-lite";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx.js";

import { chainState } from "../../../state/cosmos";
import { ORDER_TYPE, ORDER_TYPES } from "../../../types/types";
import { contractsState } from "../../../state/kogen";
import { toUtf8 } from "@cosmjs/encoding";

export function useNeutronCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { address, getSigningCosmWasmClient } = useChain(chain.chain_name);

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
      if (!address) {
        return null;
      }

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
            }),
          ),
          funds: funds,
        }),
      };

      const signClient = await getSigningCosmWasmClient();

      const result = await signClient.signAndBroadcast(
        address,
        [orderMsg],
        "auto",
      );

      console.log(result);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries([{ method: "asks" }]);
        queryClient.refetchQueries([{ method: "bids" }]);
        queryClient.refetchQueries([{ method: "locked_amount" }]);
        queryClient.refetchQueries([{ method: "position" }]);
        queryClient.refetchQueries(["get_balance", address]);
      },
    },
  );
}

export function useNeutronClosePositionOrderMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { address, getSigningCosmWasmClient } = useChain(chain.chain_name);

  const contracts = useRecoilValue(contractsState);

  return useMutation({
    mutationKey: ["closePositionOrder"],
    mutationFn: async ({
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
      if (!address) {
        return null;
      }

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
            }),
          ),
          funds: funds,
        }),
      };

      const signClient = await getSigningCosmWasmClient();

      const result = await signClient.signAndBroadcast(
        address,
        [orderMsg],
        "auto",
      );

      console.log(result);
    },

    onSuccess: () => {
      queryClient.refetchQueries([{ method: "asks" }]);
      queryClient.refetchQueries([{ method: "bids" }]);
      queryClient.refetchQueries([{ method: "locked_amount" }]);
      queryClient.refetchQueries([{ method: "position" }]);
      queryClient.refetchQueries(["get_balance", address]);
    },
  });
}

export function useNeutronExerciseCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();

  const { address, getSigningCosmWasmClient } = useChain(chain.chain_name);
  const contracts = useRecoilValue(contractsState);
  return useMutation(
    ["exercise"],
    async ({ expiry_price }: { expiry_price: string }) => {
      if (!address) {
        return null;
      }

      const exerciseMsg = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
          contract: contracts,
          sender: address,
          msg: toUtf8(
            JSON.stringify({
              exercise: {
                expiry_price,
              },
            }),
          ),
          funds: [],
        }),
      };

      const signClient = await getSigningCosmWasmClient();

      const result = await signClient.signAndBroadcast(
        address,
        [exerciseMsg],
        "auto",
      );

      console.log(result);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries([{ method: "asks" }]);
        queryClient.refetchQueries([{ method: "bids" }]);
        queryClient.refetchQueries([{ method: "locked_amount" }]);
        queryClient.refetchQueries([{ method: "position" }]);
        queryClient.refetchQueries(["get_balance", address]);
      },
    },
  );
}

export function useNeutronCancelOrderMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { address, getSigningCosmWasmClient } = useChain(chain.chain_name);

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
      if (!address) {
        return null;
      }

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
            }),
          ),
          funds: [],
        }),
      };

      const signClient = await getSigningCosmWasmClient();

      const result = await signClient.signAndBroadcast(
        address,
        [cancelOrderMsg],
        "auto",
      );

      console.log(result);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries([{ method: "asks" }]);
        queryClient.refetchQueries([{ method: "bids" }]);
        queryClient.refetchQueries([{ method: "locked_amount" }]);
        queryClient.refetchQueries([{ method: "position" }]);
        queryClient.refetchQueries(["get_balance", address]);
      },
    },
  );
}
