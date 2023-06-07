import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { chainState, keplrState } from "../../../state/cosmos";
import { ORDER_TYPE } from "../../../types/types";
import { contractsState } from "../../../state/kogen";
import { useChain } from "@cosmos-kit/react";

export function useNeutronCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();

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
      if (!keplr.account) {
        return null;
      }

      // const orderMsg = MsgExecuteContract.fromJSON({
      //   contractAddress: contracts,
      //   sender: keplr.account,
      //   msg: {
      //     [`${type}_order`]: {
      //       price,
      //       quantity,
      //     },
      //   },
      //   funds: funds,
      // });

      await new Promise((resolve) => setTimeout(resolve, 10));
      throw new Error("not implemented yet for neutron");
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

export function useNeutronExerciseCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const queryClient = useQueryClient();

  const contracts = useRecoilValue(contractsState);
  const keplr = useRecoilValue(keplrState);
  const { getSigningCosmWasmClient } = useChain(chain.chain_name);
  return useMutation(
    ["exercise"],
    async ({ expiry_price }: { expiry_price: string }) => {
      if (!keplr.account) {
        return null;
      }

      const s = await getSigningCosmWasmClient();

      console.log(s);

      // const orderMsg = MsgExecuteContract.fromJSON({
      //   contractAddress: contracts,
      //   sender: keplr.account,
      //   msg: {
      //     exercise: {
      //       expiry_price,
      //     },
      //   },
      //   funds: [],
      // });

      await new Promise((resolve) => setTimeout(resolve, 10));

      throw new Error("not implemented yet for neutron");
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
