import { useMutation } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { injectiveKeplrState } from "../../../state/cosmos";
import { useInjectiveTxData } from "../../../hooks/use-injective-tx-data";

export function useInjectiveCallOptionMutation() {
  const injectiveKeplr = useRecoilValue(injectiveKeplrState);
  const getInjectiveTxData = useInjectiveTxData();
  return useMutation<unknown, unknown>(["callOption"], async () => {
    if (!injectiveKeplr) {
      return null;
    }

    const data = await getInjectiveTxData();

    console.log(injectiveKeplr, data);
  });
}
