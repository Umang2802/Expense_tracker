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
import { add_account } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function FormDialog({ open, setOpen }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          name: add_account,
          token: token,
        })
      );

      console.log(res);

      if (res.meta.requestStatus === "fulfilled") {
        console.log("Dispatch was successful");
        setOpen(false);
      } else if (res.meta.requestStatus === "rejected") {
        console.log("Dispatch failed");
        navigate("/login");
      }
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enter Account Details</DialogTitle>
      <Divider />
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Account Name
          </Typography>
          <TextField
            autoFocus
            id="accountName"
            fullWidth
            sx={{ mb: 2 }}
            {...register("name", { required: true })}
            error={Boolean(errors.name)}
            helperText={errors.name ? "Account name is required" : ""}
          />
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Initial Amount
          </Typography>
          <TextField
            id="amount"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            {...register("amount", { required: true })}
            error={Boolean(errors.amount)}
            helperText={errors.amount ? "Initial Amount is required" : ""}
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
