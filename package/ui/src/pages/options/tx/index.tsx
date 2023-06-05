import { useRecoilValue } from "recoil";
import { chainState } from "../../../state/cosmos";
import {
  useInjectiveCallOptionMutation,
  useInjectiveExerciseCallOptionMutation,
} from "./injective";
import {
  useNeutronCallOptionMutation,
  useNeutronExerciseCallOptionMutation,
} from "./neutron";

export function useCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveCallOptionMutation();
  const neutron = useNeutronCallOptionMutation();

  if (chain.chainId === "injective-888") {
    return inj;
  }
  if (chain.chainId === "pion-1") {
    return neutron;
  }

  throw new Error("unimplemented");
}

export function useExerciseCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveExerciseCallOptionMutation();
  const neutron = useNeutronExerciseCallOptionMutation();

  if (chain.chainId === "injective-888") {
    return inj;
  }
  if (chain.chainId === "pion-1") {
    return neutron;
  }

  throw new Error("unimplemented");
}
