export const ORDER_TYPES = {
  ASK: "ask",
  BID: "bid",
};

type Keys = keyof typeof ORDER_TYPES;
export type ORDER_TYPE = (typeof ORDER_TYPES)[Keys];

export function oppositeType(type: ORDER_TYPE) {
  if (type === ORDER_TYPES.ASK) {
    return ORDER_TYPES.BID;
  } else if (type === ORDER_TYPES.BID) {
    return ORDER_TYPES.ASK;
  }

  throw new Error("Unknown type " + type);
}
