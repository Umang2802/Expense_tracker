import React, { useContext, useState } from "react";
import BasicCard from "../Components/Card";
import { Grid, Typography } from "@mui/material";
import TotalExpense from "../Components/TotalExpense";
import Modal from "../Components/AddAccountModal";
import NewTransactionModal from "../Components/NewTransactionModal";
import RecentTransactions from "../Components/RecentTransactions";
import AccountCards from "../Components/AccountCards";
import AddButton from "../Components/AddButton";
import { ContextProvider } from "../Context";
import { GET_HOME_DATA_URL } from "../services/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { apiCall } from "../redux/createAsyncThunk";
import { home } from "../redux/slices/userSlice";

const Home = () => {
  const { state } = useContext(ContextProvider);
  const [open, setOpen] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  React.useEffect(() => {
    dispatch(
      apiCall({
        url: GET_HOME_DATA_URL,
        method: "GET",
        name: home,
        token: token,
      })
    );
  }, [token, dispatch]);

  return (
    <>
      <Typography align="left" sx={{ mb: 3 }} color="grey">
        Dashboard
      </Typography>
      <Grid container spacing={2} justifyContent="left" sx={{ mb: 2 }}>
        {state.cashFlow.map((item, index) => {
          return (
            <Grid item xs={3} key={index}>
              <BasicCard
                amount={item.amount}
                tag={item.tag}
                color={item.color}
              />
            </Grid>
          );
        })}
      </Grid>
      <AccountCards setOpen={setOpen} />
      <TotalExpense />
      <RecentTransactions />
      <AddButton setOpenTransactionModal={setOpenTransactionModal} />
      <Modal open={open} setOpen={setOpen} />
      <NewTransactionModal
        openTransactionModal={openTransactionModal}
        setOpenTransactionModal={setOpenTransactionModal}
      />
    </>
  );
};

export default Home;
