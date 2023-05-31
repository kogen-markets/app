import {
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment } from "react";

export default function YourPosition() {
  return (
    <Fragment>
      <Typography variant="caption">Your position</Typography>

      <TableContainer component={Box}>
        <Table sx={{ width: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="center">
                Locked balance
              </TableCell>
              <TableCell align="right">CALL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center">0.5 ATOM</TableCell>
              <TableCell align="center">33 USDT</TableCell>
              <TableCell align="right">
                <Chip
                  label="-1"
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
    </Fragment>
  );
}
