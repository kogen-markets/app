import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react-lite";
import { MsgExecuteContractCompat } from "@injectivelabs/sdk-ts";
import { WalletStrategy, MsgBroadcaster } from "@injectivelabs/wallet-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";
import { chainState } from "../../../state/cosmos";
import { ORDER_TYPE, ORDER_TYPES } from "../../../types/types";
import { contractsState } from "../../../state/kogen";
import { TESTNET } from "../../../lib/config";
import { cosmosKitWalletToInjective } from "../../../lib/wallet";
import { metamaskWalletStrategyState } from "../../../state/injective";
import useGetAddress from "../../../hooks/use-get-address";

export function useInjectiveCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { wallet: cosmosWallet } = useChain(chain.chain_name);
  const metamaskWalletStrategy = useRecoilValue(metamaskWalletStrategyState);
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
      let walletStrategy: WalletStrategy;
      if (metamaskWalletStrategy) {
        walletStrategy = metamaskWalletStrategy;
      } else {
        if (!cosmosWallet) {
          return null;
        }
        walletStrategy = new WalletStrategy({
          chainId: chain.chain_id as ChainId,
          wallet: cosmosKitWalletToInjective(cosmosWallet.name),
        });
      }

      if (!address) {
        return null;
      }

      const orderMsg = MsgExecuteContractCompat.fromJSON({
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
        queryClient.refetchQueries([{ method: "asks" }]);
        queryClient.refetchQueries([{ method: "bids" }]);
        queryClient.refetchQueries([{ method: "locked_amount" }]);
        queryClient.refetchQueries([{ method: "position" }]);
        queryClient.refetchQueries(["get_balance", address]);
      },
    },
  );
}

export function useInjectiveClosePositionOrderMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { wallet: cosmosWallet } = useChain(chain.chain_name);
  const metamaskWalletStrategy = useRecoilValue(metamaskWalletStrategyState);
  const address = useGetAddress();

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
      let walletStrategy: WalletStrategy;
      if (metamaskWalletStrategy) {
        walletStrategy = metamaskWalletStrategy;
      } else {
        if (!cosmosWallet) {
          return null;
        }
        walletStrategy = new WalletStrategy({
          chainId: chain.chain_id as ChainId,
          wallet: cosmosKitWalletToInjective(cosmosWallet.name),
        });
      }

      if (!address) {
        return null;
      }

      const orderMsg = MsgExecuteContractCompat.fromJSON({
        contractAddress: contracts,
        sender: address,
        msg: {
          [type === ORDER_TYPES.ASK
            ? "close_long_position_order"
            : "close_short_position_order"]: {
            price,
            quantity,
          },
        },
        funds: funds,
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
    onSuccess: () => {
      queryClient.refetchQueries([{ method: "asks" }]);
      queryClient.refetchQueries([{ method: "bids" }]);
      queryClient.refetchQueries([{ method: "locked_amount" }]);
      queryClient.refetchQueries([{ method: "position" }]);
      queryClient.refetchQueries(["get_balance", address]);
    },
  });
}

export function useInjectiveExerciseCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { wallet: cosmosWallet } = useChain(chain.chain_name);
  const metamaskWalletStrategy = useRecoilValue(metamaskWalletStrategyState);
  const address = useGetAddress();

  const contracts = useRecoilValue(contractsState);
  return useMutation(
    ["exercise"],
    async ({ expiry_price }: { expiry_price?: string }) => {
      let walletStrategy: WalletStrategy;
      if (metamaskWalletStrategy) {
        walletStrategy = metamaskWalletStrategy;
      } else {
        if (!cosmosWallet) {
          return null;
        }
        walletStrategy = new WalletStrategy({
          chainId: chain.chain_id as ChainId,
          wallet: cosmosKitWalletToInjective(cosmosWallet.name),
        });
      }

      if (!address) {
        return null;
      }

      const exerciseMsg = MsgExecuteContractCompat.fromJSON({
        contractAddress: contracts,
        sender: address,
        msg: {
          exercise: {
            expiry_price,
          },
        },
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
        queryClient.refetchQueries([{ method: "asks" }]);
        queryClient.refetchQueries([{ method: "bids" }]);
        queryClient.refetchQueries([{ method: "locked_amount" }]);
        queryClient.refetchQueries([{ method: "position" }]);
        queryClient.refetchQueries(["get_balance", address]);
      },
    },
  );
}

export function useInjectiveCancelOrderMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { wallet: cosmosWallet } = useChain(chain.chain_name);
  const metamaskWalletStrategy = useRecoilValue(metamaskWalletStrategyState);
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
      let walletStrategy: WalletStrategy;
      if (metamaskWalletStrategy) {
        walletStrategy = metamaskWalletStrategy;
      } else {
        if (!cosmosWallet) {
          return null;
        }
        walletStrategy = new WalletStrategy({
          chainId: chain.chain_id as ChainId,
          wallet: cosmosKitWalletToInjective(cosmosWallet.name),
        });
      }

      if (!address) {
        return null;
      }

      const cancelOrderMsg = MsgExecuteContractCompat.fromJSON({
        contractAddress: contracts,
        sender: address,
        msg: {
          [`cancel_${type}_order`]: {
            price,
            quantity,
          },
        },
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
        msgs: [cancelOrderMsg],
        address: address,
      });

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
