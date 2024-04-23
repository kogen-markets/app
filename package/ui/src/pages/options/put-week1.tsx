import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { optionTypeState, optionWeekState } from "../../state/kogen";
import { BaseOption } from "./base";

export default function PutOptionWeek1() {
  const setCallOptionType = useSetRecoilState(optionTypeState);
  const setOptionWeek = useSetRecoilState(optionWeekState);
  useEffect(() => {
    setCallOptionType("put");
    setOptionWeek(1);
  }, [setCallOptionType, setOptionWeek]);

  return <BaseOption />;
}
