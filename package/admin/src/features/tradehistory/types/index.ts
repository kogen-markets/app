export interface Fund {
  amount: string;
  denom: string;
}

export interface TradeModel {
  _id: string;
  type: "bid" | "ask";
  price: string;
  quantity: string;
  funds: Fund[];
  prettyName: string;
  walletAddress: string;
  result: Result;
}

export interface Result {
  height: string;
  txhash: string;
  gasWanted: string;
  gasUsed: string;
  timestamp: string;
}

export interface TradeResponse {
  data: TradeModel[];
}
