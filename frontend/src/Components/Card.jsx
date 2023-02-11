import * as React from "react";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";

export default function BasicCard({ value, tag, color }) {
  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      <Typography
        variant="h5"
        component="p"
        fontWeight={500}
        letterSpacing="1px"
        fontFamily="'Poppins', sans-serif"
        color={color}
        sx={{ pt: 1 }}
      >
        {tag === "Transaction" || tag === "Add Account"
          ? value
          : value < 0
          ? `-$${Math.abs(value)}`
          : `$${value}`}
      </Typography>
      <Typography variant="caption" component="p">
        {tag}
      </Typography>
    </Paper>
  );
}
