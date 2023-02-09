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
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
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
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import PropTypes from "prop-types";
import { apiCall } from "../redux/createAsyncThunk";
import {
  ADD_ACCOUNT_URL,
  CHECK_USER_EMAIL_URL,
  SIGNUP_URL,
} from "../services/endpoints";
import {
  add_account,
  user_email,
  user_register,
} from "../redux/slices/userSlice";

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
    _id: 100,
  },
];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

export default function Signup() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const [err, setErr] = useState("");
  const [image, setImage] = useState("");
  const [cF, setCF] = useState("");
  const {
    register,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    control,
  } = useForm();

  const [userData, setUserdata] = useState();
  const [accountData, setAccountdata] = useState();

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

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  //User
  const onSubmit = async (data) => {
    console.log(data);
    try {
      if (data.confirmPassword !== data.password)
        throw new Error("Please re-enter password! Passwords doesn't match");
      else setErr("");
      delete data.confirmPassword;

      const emailCheckRes = await dispatch(
        apiCall({
          payload: data,
          url: CHECK_USER_EMAIL_URL,
          method: "POST",
          name: user_email,
        })
      );
      console.log(emailCheckRes);

      if (emailCheckRes.meta.requestStatus === "fulfilled") {
        console.log("Dispatch was successful");
        console.log(data);
        setUserdata(data);
        handleNext();
      } else if (emailCheckRes.meta.requestStatus === "rejected") {
        console.log("Login Dispatch failed");
        resetField({ ...data });
      }
    } catch (error) {
      console.log(error);
      if (err) {
        setErr(error.message);
      }
    }
  };

  const onAccountSubmit = async (data) => {
    console.log(data);
    setAccountdata(data);
    handleNext();
  };

  const onTransactionSubmit = async (data) => {
    console.log(data);
    try {
      if (image) {
        setUserdata({ ...userData, image: image });
      }

      const signUp = await dispatch(
        apiCall({
          payload: userData,
          url: SIGNUP_URL,
          method: "POST",
          name: user_register,
        })
      );
      console.log(signUp);

      if (signUp.meta.requestStatus === "fulfilled") {
        console.log("Dispatch was successful");
        const accountRes = await dispatch(
          apiCall({
            payload: accountData,
            url: ADD_ACCOUNT_URL,
            method: "GET",
            name: add_account,
            token: signUp.payload.token,
          })
        );
        console.log(accountRes);
        if (accountRes.meta.requestStatus === "fulfilled") {
          console.log("Dispatch was successful");
          navigate("/");
        } else if (accountRes.meta.requestStatus === "rejected") {
          console.log("Account Dispatch failed");
        }
      } else if (signUp.meta.requestStatus === "rejected") {
        console.log("Register Dispatch failed");
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
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          borderRadius: "5px",
          width: "100%",
          minHeight: "65%",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{ mb: 4, mt: 3, letterSpacing: "1px" }}
            fontWeight={700}
          >
            Register
          </Typography>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<QontoConnector />}
          >
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
                  <StepLabel {...labelProps} StepIconComponent={QontoStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <>
            {activeStep === 0 && (
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ p: 3, pb: 0 }}
              >
                <TextField
                  label="User Name"
                  sx={{ mb: 2 }}
                  id="username"
                  fullWidth
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
                <TextField
                  label="Email Id"
                  type="email"
                  sx={{ mb: 2 }}
                  id="email"
                  fullWidth
                  {...register("email", { required: true })}
                  error={Boolean(errors.email)}
                  helperText={errors.email ? "Email Id is required" : ""}
                />
                <TextField
                  label="Password"
                  id="password"
                  fullWidth
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
                <TextField
                  label="Confirm Password"
                  id="confirmPassword"
                  fullWidth
                  sx={{ mb: 2 }}
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
                <Grid container direction="row" justifyContent="space-between">
                  <Grid item xs={5}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={activeStep === 0}
                      sx={{ mt: 2, mb: 1 }}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, mb: 1 }}
                      type="submit"
                    >
                      Proceed
                    </Button>
                  </Grid>
                </Grid>
                <Typography sx={{ mt: 1 }}>or</Typography>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button variant="outlined" fullWidth sx={{ mt: 1, mb: 2 }}>
                    Login
                  </Button>
                </Link>
              </Box>
            )}

            {activeStep === 1 && (
              <>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 4 }}
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
                      Choose profile image
                    </Button>
                  </label>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs={5}>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={activeStep === 0}
                        sx={{ mt: 4 }}
                        onClick={handleBack}
                      >
                        Back
                      </Button>
                    </Grid>

                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 4 }}
                        onClick={handleNext}
                      >
                        Proceed
                      </Button>
                    </Grid>
                    {isStepOptional(activeStep) && (
                      <Grid item xs sx={{ mt: 2 }}>
                        <Button onClick={handleSkip}>Skip this step</Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </>
            )}

            {activeStep === 2 && (
              <Box
                component="form"
                onSubmit={handleSubmit1(onAccountSubmit)}
                sx={{ p: 3 }}
              >
                <Typography
                  align="center"
                  variant="h6"
                  sx={{ mb: 2 }}
                  fontWeight={500}
                >
                  Account details
                </Typography>
                <TextField
                  label="Account Name"
                  autoFocus
                  id="accountName"
                  fullWidth
                  sx={{ mb: 2 }}
                  {...register1("name", {
                    required: "Account Name is required",
                    pattern: {
                      value: /^[A-Za-z0-9 ]+$/i,
                      message: "Special characters are not allowed",
                    },
                  })}
                  error={Boolean(errors1.name)}
                  helperText={errors1.name ? errors1.name.message : ""}
                />
                <TextField
                  label="Initial Amount"
                  id="amount"
                  type="number"
                  sx={{ mb: 1 }}
                  inputProps={{ min: 0 }}
                  fullWidth
                  {...register1("amount", {
                    required: "Initial Amount is required",
                    min: {
                      value: 0,
                      message: "Amount should be positive",
                    },
                  })}
                  error={Boolean(errors1.amount)}
                  helperText={errors1.amount ? errors1.amount.message : ""}
                />

                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mt: 4 }}
                >
                  <Grid item xs={5}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={activeStep === 0}
                      sx={{ mt: 2, mb: 1 }}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, mb: 1 }}
                      type="submit"
                    >
                      Proceed
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 3 && (
              <Box
                component="form"
                sx={{ p: 3 }}
                onSubmit={handleSubmit2(onTransactionSubmit)}
              >
                <Typography
                  align="center"
                  variant="h6"
                  sx={{ mb: 2 }}
                  fontWeight={500}
                >
                  Transaction details
                </Typography>
                <TextField
                  label="Description"
                  autoFocus
                  sx={{ mb: 2 }}
                  id="description"
                  fullWidth
                  {...register2("description", {
                    required: "Description is required",
                    pattern: {
                      value: /^[A-Za-z0-9 ]+$/i,
                      message: "Special characters are not allowed",
                    },
                  })}
                  error={Boolean(errors2.description)}
                  helperText={
                    errors2.description ? errors2.description.message : ""
                  }
                />
                <Grid container sx={{ mb: 2 }} spacing={2}>
                  <Grid item xs={6}>
                    <FormControl
                      error={Boolean(errors2.cashFlow)}
                      sx={{ width: "100%", textAlign: "start" }}
                    >
                      <InputLabel id="cashFlow">CashFlow</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            label="cashFlow"
                            labelId="cashFlow"
                            {...register2("cashFlow", { required: true })}
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
                        {errors2.cashFlow ? "CashFlow is required" : ""}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    {cF === INCOME ? (
                      <TextField
                        label="Catergory"
                        disabled
                        sx={{ mb: 1 }}
                        id="incomeCategory"
                        fullWidth
                        {...register2("category", { required: true })}
                        value={INCOME}
                      />
                    ) : (
                      <FormControl
                        error={Boolean(errors2.category)}
                        sx={{ width: "100%", textAlign: "start" }}
                      >
                        <InputLabel id="category">Category</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              label="category"
                              labelId="category"
                              {...field}
                              {...register2("category", { required: true })}
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
                          {errors2.category ? "Category is required" : ""}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      error={Boolean(errors2.account)}
                      sx={{ width: "100%", textAlign: "start" }}
                    >
                      <InputLabel id="account">Account</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            label="account"
                            labelId="account"
                            {...field}
                            {...register2("account", { required: true })}
                            defaultValue=""
                          >
                            <MenuItem value="">None</MenuItem>
                            {accounts.map((item, index) => (
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
                        {errors2.account ? "Account is required" : ""}
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
                            {...register2("date")}
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

                <TextField
                  label="Amount"
                  id="amount"
                  sx={{ mb: 1 }}
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  {...register2("amount", {
                    required: "Amount is required",
                    min: {
                      value: 0,
                      message: "Amount should be positive",
                    },
                  })}
                  error={Boolean(errors2.amount)}
                  helperText={errors2.amount ? errors2.amount.message : ""}
                />
                <Grid container direction="row" justifyContent="space-between">
                  <Grid item xs={5}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={activeStep === 0}
                      sx={{ mt: 2, mb: 1 }}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, mb: 1 }}
                      type="submit"
                    >
                      Register
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </>
        </Box>
      </Paper>
    </Container>
  );
}
