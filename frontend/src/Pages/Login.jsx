import {
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiCall } from "../redux/createAsyncThunk";
import { LOGIN_URL } from "../services/endpoints";
import { login } from "../redux/slices/userSlice";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    dispatch(
      apiCall({
        payload: data,
        url: LOGIN_URL,
        method: "POST",
        name: login,
      })
    ).then((res) => {
      if (res.type === "user/user/login/fulfilled") {
        navigate("/");
      }
    });
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <CssBaseline />
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 4,
          borderRadius: "10px",
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography
            variant="h5"
            sx={{ mb: 4, mt: 1, letterSpacing: "1px" }}
            fontWeight={700}
          >
            Login
          </Typography>
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Email Id
          </Typography>
          <TextField
            sx={{ mb: 2 }}
            id="email"
            fullWidth
            placeholder="Enter Email Id"
            {...register("email", { required: true })}
            error={Boolean(errors.email)}
            helperText={errors.email ? "Email Id is required" : ""}
          />
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Password
          </Typography>
          <TextField
            id="password"
            fullWidth
            placeholder="Enter Password"
            type="password"
            {...register("password", { required: true })}
            error={Boolean(errors.password)}
            helperText={errors.password ? "Password is required" : ""}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 4, mb: 1, fontFamily: "'Poppins', sans-serif" }}
            type="submit"
          >
            Login
          </Button>
          <Typography>or</Typography>

          <Link to="/signUp" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1, mb: 2, fontFamily: "'Poppins', sans-serif" }}
            >
              Register
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
