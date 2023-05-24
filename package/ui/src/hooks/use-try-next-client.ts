import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { clientIxState, rpcsState } from "../state/cosmos";

export default function useTryNextClient() {
  const [, setClientIx] = useRecoilState(clientIxState);
  const rpcs = useRecoilValue(rpcsState);

  return useCallback(() => {
    console.log("trying next node");
    setClientIx((ix) => (ix + 1) % rpcs.length);
  }, [setClientIx, rpcs]);
}
