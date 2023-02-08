import {
  Box,
  Button,
  Container,
  CssBaseline,
  Input,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GET_HOME_DATA_URL, SIGNUP_URL } from "../services/endpoints";
import { apiCall } from "../redux/createAsyncThunk";
import { home, user_register } from "../redux/slices/userSlice";

const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

const SignUp = () => {
  const [err, setErr] = useState("");
  const [image, setImage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    console.log(image);
    try {
      if (data.confirmPassword !== data.password)
        throw new Error("Please re-enter password! Passwords doesn't match");
      else setErr("");
      data.image = image;
      delete data.confirmPassword;

      const signUp = await dispatch(
        apiCall({
          payload: data,
          url: SIGNUP_URL,
          method: "POST",
          name: user_register,
        })
      );
      console.log(signUp);

      if (signUp.meta.requestStatus === "fulfilled") {
        console.log("Dispatch was successful");
        const homeRes = await dispatch(
          apiCall({
            url: GET_HOME_DATA_URL,
            method: "GET",
            name: home,
            token: signUp.payload.token,
          })
        );
        console.log(homeRes);
        if (homeRes.meta.requestStatus === "fulfilled") {
          console.log("Dispatch was successful");
          navigate("/");
        } else if (homeRes.meta.requestStatus === "rejected") {
          console.log("Home Dispatch failed");
        }
      } else if (signUp.meta.requestStatus === "rejected") {
        console.log("Login Dispatch failed");
      }
    } catch (error) {
      console.log(error);
      if (err) {
        setErr(error.message);
      }
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 4,
          borderRadius: "5px",
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography
            variant="h5"
            sx={{ mb: 4, mt: 1, letterSpacing: "1px" }}
            fontWeight={700}
          >
            Register
          </Typography>
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            User Name
          </Typography>
          <TextField
            sx={{ mb: 2 }}
            id="username"
            fullWidth
            placeholder="Enter User Name"
            {...register("username", {
              required: { value: true, message: "User Name is required" },
              minLength: {
                value: 4,
                message: "Username should be atleast 4 characters long",
              },
            })}
            error={Boolean(errors.username)}
            helperText={errors.username ? errors.username.message : ""}
          />
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Email Id
          </Typography>
          <TextField
            type="email"
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
            sx={{ mb: 2 }}
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
              minLength: {
                value: 8,
                message: "Password should be minimum of 8 characters",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[\W]).{8,20}$/,
                message:
                  "Password should contain lowercase and uppercase letters, numbers and special characters",
              },
            })}
            error={Boolean(errors.password)}
            helperText={errors.password ? errors.password.message : ""}
          />
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Confirm Password
          </Typography>
          <TextField
            id="confirmPassword"
            fullWidth
            sx={{ mb: 2 }}
            placeholder="Enter Confrim Password"
            type="password"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Confirm Password is required",
              },
              minLength: {
                value: 8,
                message: "Password should be minimum of 8 characters",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[\W]).{8,20}$/,
                message:
                  "Password should contain lowercase and uppercase letters, numbers and special characters",
              },
            })}
            error={Boolean(errors.confirmPassword)}
            helperText={
              errors.confirmPassword ? errors.confirmPassword.message : ""
            }
          />
          {err !== "" && (
            <Typography
              sx={{ float: "left", mb: 1 }}
              color="red"
              fontWeight={500}
            >
              {err}
            </Typography>
          )}
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Profile Picture
          </Typography>
          <label htmlFor="profileImage">
            <Input
              sx={{ display: "none" }}
              name="profileImage"
              inputProps={{ accept: "image/*" }}
              id="profileImage"
              type="file"
              onChange={(event) => {
                fileToDataUri(event.target.files[0]).then((dataUri) =>
                  setImage(dataUri)
                );
              }}
            />
            <Button variant="contained" component="span">
              Upload profile image
            </Button>
          </label>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 4, mb: 1 }}
            type="submit"
          >
            SignUp
          </Button>
          <Typography>or</Typography>

          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button variant="contained" fullWidth sx={{ mt: 1, mb: 2 }}>
              Login
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
