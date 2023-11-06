import { useCallback } from "react";
import { SetterOrUpdater } from "recoil";
import * as R from "ramda";

export default function useOnChange<T>(setFormState: SetterOrUpdater<T>) {
  return useCallback(
    (
      e: { target: HTMLInputElement },
      getValue = (target: HTMLInputElement) =>
        target.valueAsNumber ?? target.value,
    ) => {
      const target = e.target;
      setFormState((x) =>
        R.set(R.lensPath(target.name.split(".")), getValue(target), x),
      );
    },
    [setFormState],
  );
}
