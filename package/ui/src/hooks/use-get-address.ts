import { useRecoilValue } from "recoil";
import { chainState } from "../state/cosmos";
import { useChain } from "@cosmos-kit/react-lite";
import { metamaskAddressState } from "../state/injective";

export default function useGetAddress() {
  const chain = useRecoilValue(chainState);
  const { address: cosmosAddress } = useChain(chain.chain_name);
  const metamaskAddress = useRecoilValue(metamaskAddressState);

  return cosmosAddress || metamaskAddress?.injective;
}
