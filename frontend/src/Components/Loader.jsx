import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";

export default function Loader() {
  const response = useSelector((state) => state.response);
  console.log(response);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={response.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
