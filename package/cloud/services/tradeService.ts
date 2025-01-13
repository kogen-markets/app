import Trade from "../models/tradeModel";

export const getTradeHistory = async (userId: string) => {
  try {
    const trades = await Trade.find({ userId });
    return trades;
  } catch (error) {
    throw new Error("Error fetching trade history");
  }
};
