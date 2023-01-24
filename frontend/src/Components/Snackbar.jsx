import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { ContextProvider } from "../Context";
import { ERROR } from "../data/constants";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {
  const { state, dispatch } = React.useContext(ContextProvider);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    
  };

  return (
    <>
      <Snackbar
        open={state.errorMessage === "" ? false : true}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {state.errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
