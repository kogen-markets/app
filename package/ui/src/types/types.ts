export const ORDER_TYPES = {
  ASK: "ask",
  BID: "bid",
};

type Keys = keyof typeof ORDER_TYPES;
export type ORDER_TYPE = (typeof ORDER_TYPES)[Keys];
