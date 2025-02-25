import { atom } from "recoil";

// Define types for your state
export const walletAddressState = atom<string>({
  key: "walletAddressState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (initial value)
});

export const prettyNameState = atom<string>({
  key: "prettyNameState",
  default: "Metamask", // default name
});
