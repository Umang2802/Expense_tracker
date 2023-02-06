import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Divider, MenuItem, Select, Typography } from "@mui/material";
import { INCOME, EXPENSE } from "../data/constants";
import Categories from "../data/Categories";
import { useForm } from "react-hook-form";
import { apiCall } from "../redux/createAsyncThunk";
import { useNavigate } from "react-router-dom";
import { add_transaction } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TRANSACTION_URL } from "../services/endpoints";

export default function FormDialog({
  openTransactionModal,
  setOpenTransactionModal,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await dispatch(
        apiCall({
          payload: data,
          url: ADD_TRANSACTION_URL,
          method: "POST",
          name: add_transaction,
          token: user.token,
        })
      );

      console.log(res);

      if (res.meta.requestStatus === "fulfilled") {
        console.log("Dispatch was successful");
        setOpenTransactionModal(false);
      } else if (res.meta.requestStatus === "rejected") {
        console.log("Dispatch failed");
        navigate("/login");
      }
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  };
  const [category, setCategory] = useState(INCOME);
  const [account, setAccount] = useState("");
  const [cashFlow, setCashFlow] = useState("");
  const handleClose = () => {
    setOpenTransactionModal(false);
  };

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
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Description
          </Typography>
          <TextField
            autoFocus
            sx={{ mb: 1 }}
            id="description"
            fullWidth
            {...register("description", { required: true })}
            error={Boolean(errors.description)}
            helperText={errors.description ? "Description is required" : ""}
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
            {user.accounts.map((item, index) => (
              <MenuItem key={index} value={item.name}>
                {item.name}
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
            {...register("amount", { required: true })}
            error={Boolean(errors.amount)}
            helperText={errors.amount ? "Amount is required" : ""}
          />
          <DialogActions>
            <Button type="submit">Add</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
