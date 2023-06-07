import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react";
import { MsgExecuteContract } from "@injectivelabs/sdk-ts";
import { WalletStrategy, MsgBroadcaster } from "@injectivelabs/wallet-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";
import { chainState } from "../../../state/cosmos";
import { ORDER_TYPE } from "../../../types/types";
import { contractsState } from "../../../state/kogen";
import { TESTNET } from "../../../lib/config";
import { cosmosKitWalletToInjective } from "../../../lib/wallet";

export function useInjectiveCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { address, wallet } = useChain(chain.chain_name);

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
      if (!wallet) {
        return null;
      }

      if (!address) {
        return null;
      }

      const orderMsg = MsgExecuteContract.fromJSON({
        contractAddress: contracts,
        sender: address,
        msg: {
          [`${type}_order`]: {
            price,
            quantity,
          },
        },
        funds: funds,
      });

      const walletStrategy = new WalletStrategy({
        chainId: chain.chain_id as ChainId,
        wallet: cosmosKitWalletToInjective(wallet.name),
      });

      const msgBroadcaster = new MsgBroadcaster({
        walletStrategy,
        network:
          chain.chain_id === TESTNET.INJECTIVE
            ? Network.TestnetK8s
            : Network.MainnetK8s,
        simulateTx: true,
      });

      const result = await msgBroadcaster.broadcast({
        msgs: [orderMsg],
        address: address,
      });

      console.log(result);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([{ method: "asks" }]);
        queryClient.invalidateQueries([{ method: "bids" }]);
        queryClient.invalidateQueries([{ method: "locked_amount" }]);
        queryClient.invalidateQueries([{ method: "position" }]);
      },
    }
  );
}

export function useInjectiveExerciseCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { address, wallet } = useChain(chain.chain_name);

  const contracts = useRecoilValue(contractsState);
  return useMutation(
    ["exercise"],
    async ({ expiry_price }: { expiry_price: string }) => {
      if (!wallet) {
        return null;
      }

      if (!address) {
        return null;
      }

      const exerciseMsg = MsgExecuteContract.fromJSON({
        contractAddress: contracts,
        sender: address,
        msg: {
          exercise: {
            expiry_price,
          },
        },
        funds: [],
      });

      const walletStrategy = new WalletStrategy({
        chainId: chain.chain_id as ChainId,
        wallet: cosmosKitWalletToInjective(wallet.name),
      });

      const msgBroadcaster = new MsgBroadcaster({
        walletStrategy,
        network:
          chain.chain_id === TESTNET.INJECTIVE
            ? Network.TestnetK8s
            : Network.MainnetK8s,
        simulateTx: true,
      });

      const result = await msgBroadcaster.broadcast({
        msgs: [exerciseMsg],
        address: address,
      });

      console.log(result);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([{ method: "asks" }]);
        queryClient.invalidateQueries([{ method: "bids" }]);
        queryClient.invalidateQueries([{ method: "locked_amount" }]);
        queryClient.invalidateQueries([{ method: "position" }]);
      },
    }
  );
}
