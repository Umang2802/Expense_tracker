import * as React from "react";
import Typography from "@mui/material/Typography";
import { Button, Paper } from "@mui/material";

export default function BasicCard({ amount, tag, color, onClick }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Button onClick={onClick}>
        <Typography
          variant="h5"
          component="p"
          fontWeight={500}
          letterSpacing="1px"
          fontFamily="'Poppins', sans-serif"
          color={color}
        >
          {tag === "Transaction" || tag === "Add Account"
            ? amount
            : amount < 0
            ? `-$${Math.abs(amount)}`
            : `$${amount}`}
        </Typography>
      </Button>
      <Typography variant="caption" component="p">
        {tag}
      </Typography>
    </Paper>
  );
}