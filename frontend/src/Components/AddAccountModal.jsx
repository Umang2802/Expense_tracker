import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Divider, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { apiCall } from "../redux/createAsyncThunk";
import { ADD_ACCOUNT_URL } from "../services/endpoints";
import { home } from "../redux/slices/userSlice";
import { useEffect } from "react";

export default function FormDialog({ open, setOpen }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await dispatch(
        apiCall({
          payload: data,
          url: ADD_ACCOUNT_URL,
          method: "POST",
          name: home,
          token: token,
        })
      );

      console.log(res);
      if (res.meta.requestStatus === "fulfilled") {
        console.log("Add Account Dispatch was successful");
        setOpen(false);
      } else if (res.meta.requestStatus === "rejected") {
        console.log("Add Account Dispatch failed");
      }
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  };

  useEffect(() => {
    reset({ name: "", amount: 0 });
  }, [reset, isSubmitSuccessful]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enter Account Details</DialogTitle>
      <Divider />
      <DialogContent>
        <Box noValidate component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Account Name
          </Typography>
          <TextField
            autoFocus
            id="accountName"
            fullWidth
            sx={{ mb: 2 }}
            {...register("name", {
              required: "Account Name is required",
              pattern: {
                value: /^[A-Za-z0-9 ]+$/i,
                message: "Special characters are not allowed",
              },
            })}
            error={Boolean(errors.name)}
            helperText={errors.name ? errors.name.message : ""}
          />
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Initial Amount
          </Typography>
          <TextField
            id="amount"
            type="number"
            sx={{ mb: 1 }}
            inputProps={{ min: 0 }}
            fullWidth
            {...register("amount", {
              required: "Initial Amount is required",
              min: {
                value: 0,
                message: "Amount should be positive",
              },
            })}
            error={Boolean(errors.amount)}
            helperText={errors.amount ? errors.amount.message : ""}
          />
          <DialogActions>
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
