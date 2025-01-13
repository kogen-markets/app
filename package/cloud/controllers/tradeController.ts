import { Request, Response } from "express";
import TradeModel from "../models/tradeModel"; // Replace with your actual model import

// Save a new trade
export const saveTrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, price, quantity, funds } = req.body;

    // Save trade to the database (using Mongoose or your ORM)
    const newTrade = await TradeModel.create({ type, price, quantity, funds });

    res
      .status(201)
      .json({ message: "Trade saved successfully", trade: newTrade });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving trade", error: (error as Error).message });
  }
};

// Fetch trade history
export const getTradeHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trades = await TradeModel.find(); // Fetch all trades

    res.status(200).json({ trades });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching trade history",
        error: (error as Error).message,
      });
  }
};
