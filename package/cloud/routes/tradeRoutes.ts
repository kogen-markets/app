import express from "express";
import { saveTrade, getTradeHistory } from "../controllers/tradeController";
import { authenticate } from "../utils/authMiddleware";

const router = express.Router();

router.post("/save", authenticate, saveTrade);
router.get("/history", authenticate, getTradeHistory);

export default router;
