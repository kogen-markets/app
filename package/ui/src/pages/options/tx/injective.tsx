import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import {
  chainState,
  injectiveKeplrState,
  keplrState,
} from "../../../state/cosmos";
import { MsgExecuteContract } from "@injectivelabs/sdk-ts";
import { WalletStrategy, MsgBroadcaster } from "@injectivelabs/wallet-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";
import { ORDER_TYPE } from "../../../types/types";
import { contractsState } from "../../../state/kogen";

export function useInjectiveCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();

  const injectiveKeplr = useRecoilValue(injectiveKeplrState);
  const contracts = useRecoilValue(contractsState);
  const keplr = useRecoilValue(keplrState);
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
      if (!injectiveKeplr) {
        return null;
      }

      if (!keplr.account) {
        return null;
      }

      const orderMsg = MsgExecuteContract.fromJSON({
        contractAddress: contracts,
        sender: keplr.account,
        msg: {
          [`${type}_order`]: {
            price,
            quantity,
          },
        },
        funds: funds,
      });

      const walletStrategy = new WalletStrategy({
        chainId: chain.chainId as ChainId,
      });

      const msgBroadcaster = new MsgBroadcaster({
        walletStrategy,
        network: Network.TestnetK8s,
      });

      const result = await msgBroadcaster.broadcast({
        msgs: [orderMsg],
        address: keplr.account,
      });

      console.log(result);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([{ method: "asks" }]);
        queryClient.invalidateQueries([{ method: "bids" }]);
      },
    }
  );
}
