"use client";

import React, { useEffect, useState } from "react";
import TradeTable from "./TradeTable";
import { fetchTradeHistory } from "@/features/tradehistory/api/tradeHistory";
import { TradeModel } from "@/features/tradehistory/types";
import { CircularProgress, Box } from "@mui/material";

const TradeHistory: React.FC = () => {
  const [trades, setTrades] = useState<TradeModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const tradeData = await fetchTradeHistory();
        setTrades(tradeData);
      } catch (error) {
        console.error("Failed to load trade history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrades();
  }, []);

  return (
    <Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <TradeTable trades={trades} />
      )}
    </Box>
  );
};

export default TradeHistory;
