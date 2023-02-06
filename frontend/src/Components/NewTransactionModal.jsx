import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { INCOME, EXPENSE } from "../data/constants";
import Categories from "../data/Categories";
import { Controller, useForm } from "react-hook-form";
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
    control,
  } = useForm();

  const [cF, setCF] = useState("");

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
            sx={{ mb: 2 }}
            id="description"
            fullWidth
            {...register("description", {
              required: "Description is required",
              pattern: {
                value: /^[A-Za-z0-9 ]+$/i,
                message: "Special characters are not allowed",
              },
            })}
            error={Boolean(errors.description)}
            helperText={errors.description ? errors.description.message : ""}
          />
          <Grid container sx={{ mb: 2 }}>
            <Grid container item xs={12} md={5}>
              <Grid item xs={12} md={12}>
                <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
                  Choose CashFlow
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl error={Boolean(errors.cashFlow)}>
                  <Controller
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        {...register("cashFlow", { required: true })}
                        onChange={(e) => setCF(e.target.value)}
                        defaultValue=""
                        // inputProps={{ style: "width: 100%" }}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value={INCOME}>{INCOME}</MenuItem>
                        <MenuItem value={EXPENSE}>{EXPENSE}</MenuItem>
                      </Select>
                    )}
                    control={control}
                    name="cashFlow"
                  />
                  <FormHelperText>
                    {errors.cashFlow ? "CashFlow is required" : ""}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item xs={1} md={1} justifyContent="center">
              <Divider orientation="vertical" />
            </Grid>
            <Grid container item xs={12} md={5}>
              <Grid item xs={12} md={12}>
                <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
                  Choose Category
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                {cF === INCOME ? (
                  <TextField
                    disabled
                    sx={{ mb: 1 }}
                    id="incomeCategory"
                    fullWidth
                    {...register("category", { required: true })}
                    value={INCOME}
                  />
                ) : (
                  <FormControl error={Boolean(errors.category)}>
                    <Controller
                      render={({ field }) => (
                        <Select
                          {...field}
                          displayEmpty
                          {...register("category", { required: true })}
                        >
                          <MenuItem value="">None</MenuItem>
                          {Object.keys(Categories).map(
                            (item, index) =>
                              item !== INCOME && (
                                <MenuItem key={index} value={item}>
                                  {item}
                                </MenuItem>
                              )
                          )}
                        </Select>
                      )}
                      control={control}
                      name="category"
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors.category ? "Category is required" : ""}
                    </FormHelperText>
                  </FormControl>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Choose Account
          </Typography>
          <FormControl error={Boolean(errors.account)} sx={{ mb: 2 }}>
            <Controller
              render={({ field }) => (
                <Select
                  {...field}
                  displayEmpty
                  {...register("account", { required: true })}
                >
                  <MenuItem value="">None</MenuItem>
                  {user.accounts.map((item, index) => (
                    <MenuItem key={index} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
              control={control}
              name="account"
              defaultValue=""
            />
            <FormHelperText>
              {errors.account ? "Account is required" : ""}
            </FormHelperText>
          </FormControl>
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Amount
          </Typography>
          <TextField
            id="amount"
            sx={{ mb: 1 }}
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            {...register("amount", {
              required: "Amount is required",
              min: {
                value: 0,
                message: "Amount should be positive",
              },
            })}
            error={Boolean(errors.amount)}
            helperText={errors.amount ? errors.amount.message : ""}
          />

          <DialogActions sx={{ pt: 2 }}>
            <Button variant="contained" type="submit" sx={{ px: 4 }}>
              Add
            </Button>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
