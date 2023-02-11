import { Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { BALANCE, EXPENSE, INCOME, TRANSACTION } from "../data/constants";
import BasicCard from "./Card";

const CashFlowCards = () => {
  const state = useSelector((state) => state);

  return (
    <Grid container spacing={2} justifyContent="left" sx={{ mb: 2 }}>
      <Grid item xs={3}>
        <BasicCard value={state.user.user.inflow} tag={INCOME} color="green" />
      </Grid>
      <Grid item xs={3}>
        <BasicCard value={state.user.user.outflow} tag={EXPENSE} color="red" />
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
  );
};

export default CashFlowCards;