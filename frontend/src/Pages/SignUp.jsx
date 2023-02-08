import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Container,
  CssBaseline,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { EXPENSE, INCOME } from "../data/constants";
import Categories from "../data/Categories";

const steps = [
  "Add details",
  "Profile Image",
  "Add Account",
  "Add Transaction",
];

const fileToDataUri = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

const accounts = [
  {
    name: "HDFC",
    amount: 100,
  },
];

export default function Signup() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const [err, setErr] = useState("");
  const [image, setImage] = useState("");
  const [cF, setCF] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const onDetailsSubmit = async (data) => {};
  const onAccountSubmit = async (data) => {};
  const onTransactionSubmit = async (data) => {};

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
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h5"
            sx={{ mb: 4, mt: 1, letterSpacing: "1px" }}
            fontWeight={700}
          >
            Register
          </Typography>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </>
          ) : (
            <>
              {activeStep === 0 && (
                <Box component="form" onSubmit={handleSubmit(onDetailsSubmit)}>
                  <Typography sx={{ float: "left", mb: 1 }} fontWeight={500}>
                    User Name
                  </Typography>
                  <TextField
                    sx={{ mb: 2 }}
                    id="username"
                    fullWidth
                    placeholder="Enter User Name"
                    {...register("username", {
                      required: {
                        value: true,
                        message: "User Name is required",
                      },
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
                      errors.confirmPassword
                        ? errors.confirmPassword.message
                        : ""
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
              )}

              {activeStep === 1 && (
                <Grid
                  container
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
                      Upload profile image
                    </Button>
                  </label>
                </Grid>
              )}
              {activeStep === 2 && (
                <Box
                  noValidate
                  component="form"
                  onSubmit={handleSubmit(onAccountSubmit)}
                >
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
                </Box>
              )}
              {activeStep === 3 && (
                <Box
                  noValidate
                  component="form"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    m: "auto",
                    minWidth: 500,
                  }}
                  onSubmit={handleSubmit(onTransactionSubmit)}
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
                    helperText={
                      errors.description ? errors.description.message : ""
                    }
                  />
                  <Grid container sx={{ mb: 2 }}>
                    <Grid container item xs={12} md={5}>
                      <Grid item xs={12} md={12}>
                        <Typography
                          sx={{ float: "left", mb: 1 }}
                          fontWeight={500}
                        >
                          Select CashFlow
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <FormControl error={Boolean(errors.cashFlow)}>
                          <Controller
                            render={({ field }) => (
                              <Select
                                displayEmpty
                                {...register("cashFlow", { required: true })}
                                onChange={(e) => {
                                  setCF(e.target.value);
                                  field.onChange(e);
                                }}
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
                        <Typography
                          sx={{ float: "left", mb: 1 }}
                          fontWeight={500}
                        >
                          Select Category
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
                    Select Account
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
                          {accounts.map((item, index) => (
                            <MenuItem key={index} value={item}>
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
                    Select date
                  </Typography>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                          inputFormat="DD/MM/YYYY"
                          {...register("date")}
                          renderInput={(params) => (
                            <TextField {...params} sx={{ mb: 2 }} />
                          )}
                          {...field}
                        />
                      </LocalizationProvider>
                    )}
                  />
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
                </Box>
              )}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Register" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
