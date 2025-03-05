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
import {
  useSeiCallOptionMutation,
  useSeiCancelOrderMutation,
  useSeiClosePositionOrderMutation,
  useSeiExerciseOptionMutation as useSeiExerciseOptionMutation,
} from "./sei";
import { TESTNET } from "../../../lib/config";

export function useCallOptionMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveCallOptionMutation();
  const neutron = useNeutronCallOptionMutation();
  const sei = useSeiCallOptionMutation();

  if (chain.chain_id === TESTNET.INJECTIVE) return inj;
  if (chain.chain_id === TESTNET.NEUTRON) return neutron;
  if (chain.chain_id === TESTNET.ARCHWAY) return neutron;
  if (chain.chain_id === TESTNET.SEI) return sei;

  throw new Error("unimplemented");
}

export function useCancelOrderMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveCancelOrderMutation();
  const neutron = useNeutronCancelOrderMutation();
  const sei = useSeiCancelOrderMutation();

  if (chain.chain_id === TESTNET.INJECTIVE) return inj;
  if (chain.chain_id === TESTNET.NEUTRON) return neutron;
  if (chain.chain_id === TESTNET.ARCHWAY) return neutron;
  if (chain.chain_id === TESTNET.SEI) return sei;

  throw new Error("unimplemented");
}

export function useClosePositionOrderMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveClosePositionOrderMutation();
  const neutron = useNeutronClosePositionOrderMutation();
  const sei = useSeiClosePositionOrderMutation();

  if (chain.chain_id === TESTNET.INJECTIVE) return inj;
  if (chain.chain_id === TESTNET.NEUTRON) return neutron;
  if (chain.chain_id === TESTNET.ARCHWAY) return neutron;
  if (chain.chain_id === TESTNET.SEI) return sei;

  throw new Error("unimplemented");
}

export function useExerciseOptionMutation() {
  const chain = useRecoilValue(chainState);
  const inj = useInjectiveExerciseOptionMutation();
  const neutron = useNeutronExerciseOptionMutation();
  const sei = useSeiExerciseOptionMutation();

  if (chain.chain_id === TESTNET.INJECTIVE) return inj;
  if (chain.chain_id === TESTNET.NEUTRON) return neutron;
  if (chain.chain_id === TESTNET.ARCHWAY) return neutron;
  if (chain.chain_id === TESTNET.SEI) return sei;

  throw new Error("unimplemented");
}
