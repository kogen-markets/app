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
} from "@mui/material";
import { TradeModel } from "@/features/tradehistory/types";

interface TradeTableProps {
  trades: TradeModel[];
}

const TradeTable: React.FC<TradeTableProps> = ({ trades }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const sortedTrades = [...trades].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const totalPages = Math.ceil(sortedTrades.length / rowsPerPage);
  const paginatedTrades = sortedTrades.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom>
        Trade History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Trade ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Wallet Name</TableCell>
            <TableCell>Wallet Address</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedTrades.map((trade) => (
            <TableRow key={trade._id}>
              <TableCell>{trade._id}</TableCell>
              <TableCell>{trade.type}</TableCell>
              <TableCell>{trade.price}</TableCell>
              <TableCell>{trade.quantity}</TableCell>
              <TableCell>{trade.funds[0]?.amount}</TableCell>
              <TableCell>{trade.prettyName}</TableCell>
              <TableCell>{trade.walletAddress}</TableCell>
              <TableCell>
                {new Date(trade.updatedAt).toLocaleString()}
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
