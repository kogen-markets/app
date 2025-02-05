"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Box,
  TextField,
} from "@mui/material";
import { TradeModel } from "@/features/tradehistory/types";

interface TradeTableProps {
  trades: TradeModel[];
}

const TradeTable: React.FC<TradeTableProps> = ({ trades }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredTrades = trades.filter((trade) => {
    const lowercasedFilterText = filterText.toLowerCase();
    return (
      (trade.type && trade.type.toLowerCase().includes(lowercasedFilterText)) ||
      (trade.prettyName &&
        trade.prettyName.toLowerCase().includes(lowercasedFilterText)) ||
      (trade.walletAddress &&
        trade.walletAddress.toLowerCase().includes(lowercasedFilterText))
    );
  });

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    const timestampA = a.result?.timestamp
      ? new Date(a.result.timestamp).getTime()
      : 0;
    const timestampB = b.result?.timestamp
      ? new Date(b.result.timestamp).getTime()
      : 0;
    return timestampB - timestampA;
  });

  const totalPages = Math.ceil(sortedTrades.length / rowsPerPage);
  const paginatedTrades = sortedTrades.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom>
        Trade History
      </Typography>
      <Box sx={{ m: 2, display: "flex", justifyContent: "flex-start" }}>
        <TextField
          label="Filter by Type or Wallet"
          variant="outlined"
          sx={{ width: 500 }}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          size="small"
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Trade ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Wallet Name</TableCell>
            <TableCell>Wallet Address</TableCell>
            <TableCell>txhash</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedTrades.map((trade, index) => (
            <TableRow key={trade._id}>
              <TableCell>{(page - 1) * rowsPerPage + (index + 1)}</TableCell>
              <TableCell>{trade._id}</TableCell>
              <TableCell>{trade.type}</TableCell>
              <TableCell>{trade.price}</TableCell>
              <TableCell>{trade.quantity}</TableCell>
              <TableCell>{trade.funds[0]?.amount}</TableCell>
              <TableCell>{trade.prettyName}</TableCell>
              <TableCell>{trade.walletAddress}</TableCell>
              <TableCell>{trade.result?.txhash}</TableCell>
              <TableCell>
                {trade.result?.timestamp
                  ? new Date(trade.result.timestamp).toLocaleString()
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Box>
    </TableContainer>
  );
};

export default TradeTable;
