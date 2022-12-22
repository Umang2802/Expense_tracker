import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

export default function FloatingActionButtons({ setOpenTransactionModal }) {
  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1 },
        position: "fixed",
        bottom: 25,
        right: 25,
      }}
    >
      <Fab
        color="primary"
        aria-label="add"
        style={{ padding: "35px" }}
        onClick={() => setOpenTransactionModal(true)}
      >
        <AddIcon fontSize="large" />
      </Fab>
    </Box>
  );
}
