"use client";

import { TradeModel } from "@/features/tradehistory/types";
import { client } from "@/libs/axios";

export const fetchTradeHistory = async (): Promise<TradeModel[]> => {
  const response = await client.get<TradeModel[]>("/trades/history");
  return response.data;
};

export const fetchTradeById = async (tradeId: string): Promise<TradeModel> => {
  const response = await client.get<TradeModel>(`/trades/history/${tradeId}`);
  return response.data;
};
