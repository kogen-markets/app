import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { optionTypeState } from "../../state/kogen";
import { BaseOption } from "./base";

export default function PutOption() {
  const setCallOptionType = useSetRecoilState(optionTypeState);
  useEffect(() => {
    setCallOptionType("put");
  }, [setCallOptionType]);

  return <BaseOption />;
}
