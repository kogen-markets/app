import { atom } from "recoil";

export const snackbarState = atom<{
  message: string;
  type?: "error" | "success" | "info" | "warning";
} | null>({
  key: "snackbarState",
  default: null,
});
