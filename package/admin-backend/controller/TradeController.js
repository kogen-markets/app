const Trade = require("../models/TradeModel");

exports.saveTrade = async (req, res) => {
  const { order, result, walletAddress, prettyName } = req.body;

  if (!order || !result || !walletAddress || !prettyName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newTrade = new Trade({
    type: order.type,
    price: order.price,
    quantity: order.quantity,
    funds: order.funds,
    walletAddress,
    prettyName,
    result,
  });

  try {
    await newTrade.save();
    return res.status(201).json({ message: "Trade saved successfully", trade: newTrade });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error saving trade", error: error.message });
  }
};

exports.getTradeHistory = async (req, res) => {
  try {
    console.log("trades========>");
    const trades = await Trade.find(); // Fetch all trades
    console.log("trades", trades);

    if (trades.length === 0) {
      return res.status(404).json({ message: "No trades found." });
    }

    return res.status(200).json(trades);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Error fetching trade history",
        error: error.message,
      });
  }
};

exports.getTradeById = async (req, res) => {
  const { tradeId } = req.params;

  try {
    const trade = await Trade.findById(tradeId);

    if (!trade) {
      return res.status(404).json({ message: "Trade not found." });
    }

    return res.status(200).json({ trade });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Error fetching trade details",
        error: error.message,
      });
  }
};

exports.deleteTrade = async (req, res) => {
  const { tradeId } = req.params;

  try {
    const trade = await Trade.findByIdAndDelete(tradeId);

    if (!trade) {
      return res.status(404).json({ message: "Trade not found." });
    }

    return res.status(200).json({ message: "Trade deleted successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Error deleting trade",
        error: error.message,
      });
  }
};
