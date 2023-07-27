import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { useChain } from "@cosmos-kit/react-lite";
import { MsgExecuteContractCompat } from "@injectivelabs/sdk-ts";
import { WalletStrategy, MsgBroadcaster } from "@injectivelabs/wallet-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";
import { chainState } from "../../../state/cosmos";
import { ORDER_TYPE } from "../../../types/types";
import { contractsState } from "../../../state/kogen";
import { TESTNET } from "../../../lib/config";
import { cosmosKitWalletToInjective } from "../../../lib/wallet";
import {
  metamaskAddressState,
  metamaskWalletStrategyState,
} from "../../../state/injective";

export function useInjectiveCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { address: cosmosAddress, wallet: cosmosWallet } = useChain(
    chain.chain_name,
  );
  const metamaskWalletStrategy = useRecoilValue(metamaskWalletStrategyState);
  const metamaskAddress = useRecoilValue(metamaskAddressState);
  const address = cosmosAddress || metamaskAddress?.injective;

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
        queryClient.invalidateQueries([{ method: "asks" }]);
        queryClient.invalidateQueries([{ method: "bids" }]);
        queryClient.invalidateQueries([{ method: "locked_amount" }]);
        queryClient.invalidateQueries([{ method: "position" }]);
        queryClient.invalidateQueries(["get_balance", address]);
      },
    },
  );
}

export function useInjectiveExerciseCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();
  const { address: cosmosAddress, wallet: cosmosWallet } = useChain(
    chain.chain_name,
  );
  const metamaskWalletStrategy = useRecoilValue(metamaskWalletStrategyState);
  const metamaskAddress = useRecoilValue(metamaskAddressState);
  const address = cosmosAddress || metamaskAddress?.injective;

  const contracts = useRecoilValue(contractsState);
  return useMutation(
    ["exercise"],
    async ({ expiry_price }: { expiry_price: string }) => {
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
        queryClient.invalidateQueries([{ method: "asks" }]);
        queryClient.invalidateQueries([{ method: "bids" }]);
        queryClient.invalidateQueries([{ method: "locked_amount" }]);
        queryClient.invalidateQueries([{ method: "position" }]);
        queryClient.invalidateQueries(["get_balance", address]);
      },
    },
  );
}
