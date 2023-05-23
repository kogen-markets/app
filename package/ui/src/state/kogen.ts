import { atom, atomFamily } from "recoil";
import {
  localStorageEffect,
  LOCAL_STORAGE_SELECTED_DENS,
  LOCAL_STORAGE_DARK_MODE,
} from "./effects";

export const densInitializedState = atom({
  key: "densInitializedState",
  default: false,
});

export const darkModeState = atom<"dark" | "light" | "auto">({
  key: "darkModeState",
  default: "dark",
  effects: [localStorageEffect(LOCAL_STORAGE_DARK_MODE)],
});

export const selectedDensState = atomFamily<string | null, string | null>({
  key: "selectedDensState",
  default: () => null,
  effects: (account) => {
    if (!account) {
      return [];
    }

    const key = `${account}`;
    return [localStorageEffect(key, LOCAL_STORAGE_SELECTED_DENS)];
  },
});
