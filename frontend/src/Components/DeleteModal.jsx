import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";
import {
  DELETE_ACCOUNT_URL,
  DELETE_TRANSACTION_URL,
} from "../services/endpoints";
import { apiCall } from "../redux/createAsyncThunk";
import { useDispatch, useSelector } from "react-redux";
import { home } from "../redux/slices/userSlice";

export default function DeleteModal({ id, open, setOpen, modalName }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const handleDelete = async () => {
    try {
      const res = await dispatch(
        apiCall({
          url:
            modalName === "Delete Transaction"
              ? DELETE_TRANSACTION_URL + id
              : DELETE_ACCOUNT_URL + id,
          method: "DELETE",
          name: home,
          token: token,
        })
      );

      console.log(res);

      if (res.meta.requestStatus === "fulfilled") {
        console.log("Delete Transaction Dispatch was successful");
        setOpen(false);
      } else if (res.meta.requestStatus === "rejected") {
        console.log("Delete Transaction Dispatch failed");
      }
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{modalName}</DialogTitle>
      <Divider />
      <DialogContent>Are you sure you want to delete?</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button onClick={handleDelete} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
