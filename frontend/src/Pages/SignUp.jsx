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
import { Link } from "react-router-dom";

const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

const SignUp = () => {
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    try {
      if (data.confirmPassword !== data.password)
        throw new Error("Please re-enter password! Passwords doesn't match");
      else setError("");

      console.log(image);
    } catch (error) {
      setError(error.message);
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
            Email Id
          </Typography>
          <TextField
            sx={{ mb: 2 }}
            id="emailId"
            fullWidth
            placeholder="Enter Email Id"
            {...register("emailId", { required: true })}
            error={Boolean(errors.emailId)}
            helperText={errors.emailId ? "Email Id is required" : ""}
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
            {...register("password", { required: true })}
            error={Boolean(errors.password)}
            helperText={errors.password ? "Password is required" : ""}
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
            {...register("confirmPassword", { required: true })}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword ? "Password is required" : ""}
          />
          {error !== "" && (
            <Typography
              sx={{ float: "left", mb: 1 }}
              color="red"
              fontWeight={500}
            >
              {error}
            </Typography>
          )}
          <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
            Profile Picture
          </Typography>
          <Input
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
