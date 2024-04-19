import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { optionTypeState, optionWeekState } from "../../state/kogen";
import { BaseOption } from "./base";

export default function CallOptionWeek1() {
  const setCallOptionType = useSetRecoilState(optionTypeState);
  const setOptionWeek = useSetRecoilState(optionWeekState);
  useEffect(() => {
    setCallOptionType("call");
    setOptionWeek(1);
  }, [setCallOptionType, setOptionWeek]);

  return <BaseOption />;
}
