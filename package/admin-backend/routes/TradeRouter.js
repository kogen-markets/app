const router = require("express").Router();
const TradeController = require("../controller/TradeController");

console.log("trade router");

router
  .post("/save", TradeController.saveTrade)
  .get("/history", TradeController.getTradeHistory)
  .get("/:tradeId", TradeController.getTradeById)
  .delete("/:tradeId", TradeController.deleteTrade);

module.exports = router;
