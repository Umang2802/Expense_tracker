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
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      {children}
    </Box>
  );
};

export default Container;
