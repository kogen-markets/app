"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { TradeModel } from "@/features/tradehistory/types";

interface TradeTableProps {
  trades: TradeModel[];
}

const TradeTable: React.FC<TradeTableProps> = ({ trades }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom>
        Trade History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Trade ID</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>{trade.id}</TableCell>
              <TableCell>{trade.asset}</TableCell>
              <TableCell>{trade.quantity}</TableCell>
              <TableCell>{trade.price}</TableCell>
              <TableCell>{new Date(trade.date).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TradeTable;
