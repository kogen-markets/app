import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { optionTypeState } from "../../state/kogen";
import { BaseOption } from "./base";

export default function CallOption() {
  const setCallOptionType = useSetRecoilState(optionTypeState);
  useEffect(() => {
    setCallOptionType("call");
  }, [setCallOptionType]);

  return <BaseOption />;
}
