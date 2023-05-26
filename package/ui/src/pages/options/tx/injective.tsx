import { useMutation } from "@tanstack/react-query";
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
import { getConfig } from "../../../lib/config";
import { ORDER_TYPE } from "../../../types/types";

export function useInjectiveCallOptionMutation() {
  const chain = useRecoilValue(chainState);

  const injectiveKeplr = useRecoilValue(injectiveKeplrState);
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
        contractAddress: getConfig(chain.chainId).optionsContract,
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
    }
  );
}
