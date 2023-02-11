import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { INCOME, EXPENSE } from "../data/constants";
import Categories from "../data/Categories";
import { Controller, useForm } from "react-hook-form";
import { apiCall } from "../redux/createAsyncThunk";
import { home } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TRANSACTION_URL } from "../services/endpoints";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
  const user = useSelector((state) => state.user);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await dispatch(
        apiCall({
          payload: data,
          url: ADD_TRANSACTION_URL,
          method: "POST",
          name: home,
          token: user.token,
        })
      );

      console.log(res);
      if (res.meta.requestStatus === "fulfilled") {
        console.log("AddTransaction was successful");
        setOpenTransactionModal(false);
      } else if (res.meta.requestStatus === "rejected") {
        console.log("Add Transaction Dispatch failed");
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
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <TextField
            label="Description"
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
          <Grid container sx={{ mb: 2 }} spacing={2}>
            <Grid item xs={6}>
              <FormControl
                error={Boolean(errors.cashFlow)}
                sx={{ width: "100%", textAlign: "start" }}
              >
                <InputLabel id="cashFlow">CashFlow</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      label="cashFlow"
                      labelId="cashFlow"
                      {...register("cashFlow", { required: true })}
                      onChange={(e) => {
                        setCF(e.target.value);
                        field.onChange(e);
                      }}
                      defaultValue=""
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
            <Grid item xs={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      inputFormat="DD/MM/YYYY"
                      {...register("date")}
                      renderInput={(params) => (
                        <TextField {...params} label="Date" />
                      )}
                      {...field}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
          </Grid>

          {cF === INCOME ? (
            <TextField
              label="Catergory"
              disabled
              sx={{ mb: 2 }}
              id="incomeCategory"
              fullWidth
              {...register("category", { required: true })}
              value={INCOME}
            />
          ) : (
            <FormControl
              error={Boolean(errors.category)}
              sx={{ width: "100%", textAlign: "start", mb: 2 }}
            >
              <InputLabel id="category">Category</InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    label="category"
                    labelId="category"
                    {...field}
                    {...register("category", { required: true })}
                    MenuProps={MenuProps}
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

          <FormControl
            error={Boolean(errors.account)}
            sx={{ width: "100%", textAlign: "start", mb: 2 }}
          >
            <InputLabel id="account">Account</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  label="account"
                  labelId="account"
                  {...field}
                  {...register("account", { required: true })}
                  defaultValue=""
                  MenuProps={MenuProps}
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
            />
            <FormHelperText>
              {errors.account ? "Account is required" : ""}
            </FormHelperText>
          </FormControl>

          <TextField
            label="Amount"
            id="amount"
            sx={{ mb: 2 }}
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
          <Button variant="contained" fullWidth sx={{ my: 1 }} type="submit">
            Register
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
