import {
  Avatar,
  Box,
  Button,
  Grid,
  Input,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_HOME_DATA_URL, UPDATE_USER_URL } from "../services/endpoints";
import { apiCall } from "../redux/createAsyncThunk";
import { home, user_update } from "../redux/slices/userSlice";

const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [pass, setPass] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      if (!pass) {
        delete data.password;
        delete data.confirmPassword;
      }
      if (pass && data.confirmPassword !== data.password)
        throw new Error("Please re-enter password! Passwords doesn't match");
      else setError("");
      data.image = image;
      delete data.confirmPassword;

      const res = await dispatch(
        apiCall({
          payload: data,
          url: UPDATE_USER_URL,
          method: "PUT",
          name: user_update,
          token: user.token,
        })
      );

      if (res.meta.requestStatus === "fulfilled") {
        console.log("Dispatch was successful");
        const homeRes = await dispatch(
          apiCall({
            url: GET_HOME_DATA_URL,
            method: "GET",
            name: home,
            token: user.token,
          })
        );
        console.log(homeRes);
        if (homeRes.meta.requestStatus === "fulfilled") {
          console.log("Dispatch was successful");
        } else if (homeRes.meta.requestStatus === "rejected") {
          console.log("Home Dispatch failed");
        }
      } else if (res.meta.requestStatus === "rejected") {
        console.log("Login Dispatch failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const tempUser = user.user;
    setValue("username", tempUser.username);
    setImage(tempUser.profileImage ? tempUser.profileImage.imageUrl : "");
  }, [setValue, user.user, setImage]);

  return (
    <Paper
      elevation={5}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 4,
        borderRadius: "5px",
        height: "100%",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "70%", m: "auto" }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 4, mt: 1, letterSpacing: "1px" }}
          fontWeight={700}
        >
          Edit Profile
        </Typography>
        <Grid container justifyContent="space-between">
          <Grid item xs={6}>
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
              disabled
              sx={{ mb: 2 }}
              id="email"
              fullWidth
              value={user.user.email}
            />
            <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
              New password
            </Typography>
            <Controller
              render={({ field }) => (
                <TextField
                  id="password"
                  fullWidth
                  placeholder="Enter new password"
                  type="password"
                  sx={{ mb: 2 }}
                  {...register("password", {
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
                  onChange={(e) => {
                    console.log(e.target.value);
                    setPass(e.target.value);
                    field.onChange(e);
                  }}
                  error={Boolean(errors.password)}
                  helperText={errors.password ? errors.password.message : ""}
                />
              )}
              control={control}
              name="password"
            />
            {pass && (
              <>
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
                      value: pass ? true : false,
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
              </>
            )}
          </Grid>
          <Grid
            container
            item
            xs={5}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              alt="User image"
              src={
                image
                  ? image
                  : "https://tse1.mm.bing.net/th/id/OIP.1VIzl4Px0aT3Zveh0J_Y3gHaHx?pid=ImgDet&w=500&h=525&rs=1"
              }
              sx={{ width: 200, height: 200, my: 3 }}
            />
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
                Change profile image
              </Button>
            </label>
          </Grid>
        </Grid>

        {error !== "" && (
          <Typography
            sx={{ float: "left", mb: 1 }}
            color="red"
            fontWeight={500}
          >
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 4, mb: 1 }}
          type="submit"
        >
          Update profile
        </Button>
      </Box>
    </Paper>
  );
};

export default EditProfile;
