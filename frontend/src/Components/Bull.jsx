import { Box } from "@mui/material";

const Bull = ({ color }) => {
  return (
    <Box
      style={{
        // display: "inline-block",
        fontSize: "35px",
        lineHeight: "1px",
        color: color,
      }}
    >
      •
    </Box>
  );
};

export default Bull;
