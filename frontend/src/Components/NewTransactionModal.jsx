import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Divider, MenuItem, Select, Typography } from "@mui/material";
// import dateFormat from "dateformat";
import { ContextProvider } from "../Context";
import { ADD_TRANSACTION, INCOME, ERROR, EXPENSE } from "../data/constants";
import Categories from "../data/Categories";
// import { useForm } from "react-hook-form";
import axios from "axios";

export default function FormDialog({
  openTransactionModal,
  setOpenTransactionModal,
}) {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  // const onSubmit = (data) => console.log(data);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(INCOME);
  const [description, setDescription] = useState("");
  const [account, setAccount] = useState("");
  const [cashFlow, setCashFlow] = useState("");
  const { state, dispatch } = useContext(ContextProvider);

  const handleClose = () => {
    setOpenTransactionModal(false);
  };

  const newTransactionHandler = () => {
    axios
      .post("http://localhost:5000/transaction/add", {
        // date: dateFormat(new Date(), "yyyy-mm-dd").toString(),
        category: category,
        account: account,
        description: description,
        // amount: amount,
        cashFlow: cashFlow,
      })
      .then((res) =>
        dispatch({
          type: ADD_TRANSACTION,
          payload: {
            date: res.data.date,
            category: res.data.category,
            account: res.data.account,
            description: res.data.description,
            amount: res.data.amount,
            cashFlow: res.data.cashFlow,
          },
        })
      )
      .catch((err) =>
        dispatch({
          type: ERROR,
          payload: {
            errorMessage: "Failed to add transaction",
          },
        })
      );

    setOpenTransactionModal(false);
    setAccount("");
    setAmount("");
    setCategory("");
    setDescription("");
    setCashFlow("");
  };

  useEffect(() => {}, []);

  return (
    <Dialog open={openTransactionModal} onClose={handleClose} sx={{ p: 2 }}>
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
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Description
          </Typography>
          <TextField
            autoFocus
            sx={{ mb: 1 }}
            id="description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Cash Flow
          </Typography>
          <Select
            sx={{ mb: 1 }}
            id="cashFlow-select"
            displayEmpty
            value={cashFlow}
            onChange={(e) => setCashFlow(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value={INCOME}>{INCOME}</MenuItem>
            <MenuItem value={EXPENSE}>{EXPENSE}</MenuItem>
          </Select>
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Category
          </Typography>
          {cashFlow === INCOME ? (
            <TextField
              disabled
              sx={{ mb: 1 }}
              id="incomeCategory"
              fullWidth
              value={INCOME}
            />
          ) : (
            <Select
              id="category-select"
              value={category}
              fullWidth
              sx={{ mb: 1 }}
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.keys(Categories).map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          )}
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Account
          </Typography>
          <Select
            id="account-select"
            value={account}
            sx={{ mb: 1 }}
            onChange={(e) => setAccount(e.target.value)}
          >
            {state.accounts.map((item, index) => (
              <MenuItem key={index} value={item.tag}>
                {item.tag}
              </MenuItem>
            ))}
          </Select>
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Amount
          </Typography>
          <TextField
            id="amount"
            sx={{ mb: 1 }}
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
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
  );
}
