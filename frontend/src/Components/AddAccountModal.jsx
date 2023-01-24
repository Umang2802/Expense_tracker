import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider, Typography } from "@mui/material";
import { ContextProvider } from "../Context";
import { ADD_ACCOUNT } from "../data/constants";

export default function FormDialog({ open, setOpen, accounts, setAccounts }) {
  const Context = useContext(ContextProvider);
  const [initialAmount, setInitialAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const colors = ["#FF9800", "#2E93fA", "#66DA26", "#546E7A", "#E91E63"];

  const handleClose = () => {
    setOpen(false);
  };

  const accountHandler = () => {
    Context.dispatch({
      type: ADD_ACCOUNT,
      payload: {
        amount: initialAmount,
        tag: accountName,
        color: colors[Math.ceil(Math.random() * 5)],
      },
    });

    setOpen(false);
    setInitialAmount("");
    setAccountName("");
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter Account Details</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Account Name
          </Typography>
          <TextField
            autoFocus
            id="accountName"
            fullWidth
            value={accountName}
            sx={{ mb: 2 }}
            onChange={(e) => setAccountName(e.target.value)}
          />
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Initial Amount
          </Typography>
          <TextField
            id="amount"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={accountHandler}>Add</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
