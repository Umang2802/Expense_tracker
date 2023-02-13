import * as React from "react";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function BasicCard({ value, tag, color }) {
  return (
    <Paper sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
      <Typography
        component="p"
        fontWeight={500}
        fontFamily="'Poppins', sans-serif"
        color={color}
        sx={{
          pt: 1,
          fontSize: { xs: "1rem", sm: "1.5rem" },
          letterSpacing: { sm: "1px" },
        }}
      >
        {tag === "Transactions" || tag === "Add Account" ? (
          value
        ) : value < 0 ? (
          <>
            -
            <CurrencyRupeeIcon
              sx={{
                paddingTop: "4px",
                fontSize: { xs: "x-small", sm: "x-large" },
              }}
            />
            {Math.abs(value)}
          </>
        ) : (
          <>
            <CurrencyRupeeIcon
              sx={{
                paddingTop: "4px",
                fontSize: { xs: "large", sm: "x-large" },
              }}
            />
            {value}
          </>
        )}
      </Typography>
      <Typography
        variant="caption"
        component="p"
        sx={{ fontSize: { sm: "1.5rem" } }}
      >
        {tag}
      </Typography>
    </Paper>
  );
}
