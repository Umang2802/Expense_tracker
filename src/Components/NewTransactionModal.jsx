import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Divider, InputLabel, MenuItem, Select } from "@mui/material";
import dateFormat from "dateformat";
import { ContextProvider } from "../Context";
import { ADD_TRANSACTION } from "../data/constants";
import Categories from "../data/Categories";

export default function FormDialog({
  openTransactionModal,
  setOpenTransactionModal,
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [account, setAccount] = useState("");
  const [cashFlow, setCashFlow] = useState("");

  const Context = useContext(ContextProvider);

  const handleClose = () => {
    setOpenTransactionModal(false);
  };

  const newTransactionHandler = () => {
    Context.dispatch({
      type: ADD_TRANSACTION,
      payload: {
        date: dateFormat(new Date(), "dd-mm-yyyy"),
        category,
        account,
        description,
        amount,
        cashFlow,
      },
    });

    setOpenTransactionModal(false);
    setAccount("");
    setAmount("");
    setCategory("");
    setDescription("");
    setCashFlow("");
  };

  return (
    <div>
      <Dialog open={openTransactionModal} onClose={handleClose}>
        <DialogTitle>Enter Transaction Details</DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              minWidth: 500,
            }}
          >
            <InputLabel id="description_label">Description</InputLabel>
            <TextField
              autoFocus
              labelId="description_label"
              margin="dense"
              id="description"
              // label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={true}
            />
            <InputLabel id="cashFlow">Cash Flow</InputLabel>
            <Select
              labelId="cashFlow"
              id="cashFlow-select"
              value={cashFlow}
              label="cashFlow"
              onChange={(e) => setCashFlow(e.target.value)}
            >
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="Spending">Spending</MenuItem>
            </Select>
            <InputLabel id="category">Category</InputLabel>
            {cashFlow === "Credit" ? (
              <TextField
                required
                disabled
                labelId="category"
                margin="dense"
                id="incomeCategory"
                type="text"
                fullWidth
                variant="outlined"
                value="Income"
                onChange={(e) => setCashFlow(e.target.value)}
              />
            ) : (
              <Select
                labelId="category"
                id="category-select"
                value={category}
                label="Category"
                fullWidth
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.keys(Categories).map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
                {/* {Context.state.categories.map((item, index) => (
                  <MenuItem key={index} value={item.type}>
                    {item.type}
                  </MenuItem>
                ))} */}
              </Select>
            )}
            <InputLabel id="account">Account</InputLabel>
            <Select
              labelId="account"
              id="account-select"
              value={account}
              label="Account"
              onChange={(e) => setAccount(e.target.value)}
            >
              {Context.state.accounts.map((item, index) => (
                <MenuItem key={index} value={item.tag}>
                  {item.tag}
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="amount_label">Amount</InputLabel>
            <TextField
              required
              margin="dense"
              labelId="amount_label"
              id="amount"
              // label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={newTransactionHandler}>Add</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
