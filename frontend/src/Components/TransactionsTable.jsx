import { Divider, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ContextProvider } from "../Context";
import { INCOME } from "../data/constants";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(0,0,0,0.1)",
    fontWeight: 700,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TransactionsTable = ({ noOfTransactions, title }) => {
  const Context = React.useContext(ContextProvider);

  return (
    <Paper elevation={2} sx={{ mt: 2 }}>
      <Typography align="left" sx={{ p: 2 }}>
        <b>{title}</b>
      </Typography>
      <Divider />
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Account</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell align="right">Amount</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Context.state.transactions?.map(
                (transaction, index) =>
                  index < noOfTransactions && (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {transaction.date}
                      </StyledTableCell>
                      <StyledTableCell>{transaction.category}</StyledTableCell>
                      <StyledTableCell>{transaction.account}</StyledTableCell>
                      <StyledTableCell>
                        {transaction.description}
                      </StyledTableCell>
                      {transaction.cashFlow === INCOME ? (
                        <StyledTableCell align="right" sx={{ color: "green" }}>
                          + ${transaction.amount}
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell align="right" sx={{ color: "red" }}>
                          - ${transaction.amount}
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default TransactionsTable;
