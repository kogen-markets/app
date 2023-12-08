import { useRecoilValue } from "recoil";
import { chainState } from "../../../state/cosmos";
import {
  useInjectiveCallOptionMutation,
  useInjectiveCancelOrderMutation,
  useInjectiveClosePositionOrderMutation,
  useInjectiveExerciseCallOptionMutation as useInjectiveExerciseOptionMutation,
} from "./injective";
import {
  useNeutronCallOptionMutation,
  useNeutronCancelOrderMutation,
  useNeutronClosePositionOrderMutation,
  useNeutronExerciseCallOptionMutation as useNeutronExerciseOptionMutation,
} from "./neutron";
import { TESTNET } from "../../../lib/config";

export function useCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveCallOptionMutation();
  const neutron = useNeutronCallOptionMutation();

  if (chain.chain_id === TESTNET.INJECTIVE) {
    return inj;
  }
  if (chain.chain_id === TESTNET.NEUTRON) {
    return neutron;
  }
  if (chain.chain_id === TESTNET.ARCHWAY) {
    return neutron;
  }

  throw new Error("unimplemented");
}

export function useClosePositionOrderMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveClosePositionOrderMutation();
  const neutron = useNeutronClosePositionOrderMutation();

  if (chain.chain_id === TESTNET.INJECTIVE) {
    return inj;
  }
  if (chain.chain_id === TESTNET.NEUTRON) {
    return neutron;
  }
  if (chain.chain_id === TESTNET.ARCHWAY) {
    return neutron;
  }

  throw new Error("unimplemented");
}

export function useExerciseOptionMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveExerciseOptionMutation();
  const neutron = useNeutronExerciseOptionMutation();

  if (chain.chain_id === TESTNET.INJECTIVE) {
    return inj;
  }
  if (chain.chain_id === TESTNET.NEUTRON) {
    return neutron;
  }
  if (chain.chain_id === TESTNET.ARCHWAY) {
    return neutron;
  }

  throw new Error("unimplemented");
}

export function useCancelOrderMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveCancelOrderMutation();
  const neutron = useNeutronCancelOrderMutation();

  if (chain.chain_id === TESTNET.INJECTIVE) {
    return inj;
  }
  if (chain.chain_id === TESTNET.NEUTRON) {
    return neutron;
  }
  if (chain.chain_id === TESTNET.ARCHWAY) {
    return neutron;
  }

  throw new Error("unimplemented");
}
