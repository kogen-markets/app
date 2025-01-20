export interface TradeModel {
  id: string;
  asset: string;
  quantity: number;
  price: number;
  date: string;
}

export interface TradeResponse {
  data: TradeModel[];
}
