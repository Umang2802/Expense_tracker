import React, { useState, useEffect } from "react";
import BasicCard from "../Components/Card";
import { Grid, Typography } from "@mui/material";
import TotalExpense from "../Components/TotalExpense";
import Modal from "../Components/AddAccountModal";
import NewTransactionModal from "../Components/NewTransactionModal";
import RecentTransactions from "../Components/RecentTransactions";
import AccountCards from "../Components/AccountCards";
import AddButton from "../Components/AddButton";
import { useSelector } from "react-redux";
import { BALANCE, EXPENSE, INCOME, TRANSACTION } from "../data/constants";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const navigate = useNavigate();
  const state = useSelector((state) => state);

  useEffect(() => {
    if (state.response.responseStates === "error") {
      navigate("/login");
    }
  }, [state.response.responseStates, navigate]);

  return (
    <>
      <Typography align="left" sx={{ mb: 3 }} color="grey">
        Dashboard
      </Typography>
      <Grid container spacing={2} justifyContent="left" sx={{ mb: 2 }}>
        <Grid item xs={3}>
          <BasicCard
            value={state.user.user.inflow}
            tag={INCOME}
            color="green"
          />
        </Grid>
        <Grid item xs={3}>
          <BasicCard
            value={state.user.user.outflow}
            tag={EXPENSE}
            color="red"
          />
        </Grid>
        <Grid item xs={3}>
          <BasicCard
            value={state.user.user.inflow - state.user.user.outflow}
            tag={BALANCE}
            color="blue"
          />
        </Grid>
        <Grid item xs={3}>
          <BasicCard
            value={state.user.transactions.length}
            tag={TRANSACTION}
            color="grey"
          />
        </Grid>
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
