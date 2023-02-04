import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {
  const response = useSelector((state) => state.response);
  console.log("from snackbar");
  console.log(response);

  const [open, setOpen] = React.useState(
    response.message !== "" ? true : false
  );
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(response.message !== "" ? true : false);
  }, [response]);

  return (
    <>
      {response.message && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={response.responseStates}
            sx={{ width: "100%" }}
          >
            {response.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
