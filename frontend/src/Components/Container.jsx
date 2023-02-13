import { Box } from "@mui/material";
import React from "react";

const Container = ({ children, drawerWidth }) => {
  return (
    <Box
      bgcolor="#F0F8FF"
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        m: 0,
        width: { xs: `calc(100% - ${drawerWidth}px)` },
        minHeight: "100vh",
      }}
    >
      {children}
    </Box>
  );
};

export default Container;
