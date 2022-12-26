import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import Bull from "./Bull";
import colors from "../data/colors";
import { ContextProvider } from "../Context";
import { CREDIT } from "../data/constants";

const BasicTable = ({ date, categories, totalAmount }) => {
  const newCat = Object.keys(categories)
    .filter((e) => categories[`${e}`] !== 0)
    .filter((e) => e !== "Income");

  // const { state } = React.useContext(ContextProvider);
  const TableCells = styled(TableCell)(() => ({
    padding: 2,
  }));

  return (
    <Table sx={{ minWidth: 200, border: 0, mt: 3 }} aria-label="simple table">
      <TableBody>
        {newCat.map((row, i) => (
          <TableRow
            key={i}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCells scope="row" sx={{ border: 0, boxShadow: "none" }}>
              <Bull color={colors[i]} />
            </TableCells>
            <TableCells scope="row" sx={{ border: 0, boxShadow: "none" }}>
              {row}
            </TableCells>
            <TableCells align="right" sx={{ border: 0, boxShadow: "none" }}>
              {categories[`${row}`]}
            </TableCells>
            <TableCells align="right" sx={{ border: 0, boxShadow: "none" }}>
              {Math.ceil((categories[`${row}`] / totalAmount) * 100)}%
            </TableCells>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BasicTable;
