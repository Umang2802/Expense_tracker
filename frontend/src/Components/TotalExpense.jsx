import { Grid, Paper, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DoughnutChart from "./DoughnutChart";
import Calender from "./Calender";
import BasicTable from "./Table";
import { ContextProvider } from "../Context";
import Categories from "../data/Categories";
import { INCOME } from "../data/constants";

const findTotal = (Transactions, startDate, endDate) => {
  let cat = { ...Categories };

  Transactions.filter((e) => e.category !== INCOME)
    .filter((e) => new Date(e.date) >= startDate && new Date(e.date) <= endDate)
    .forEach((e) => {
      cat[`${e.category}`] += parseInt(e.amount);
    });

  return cat;
};

const TotalExpense = () => {
  const [date, setDate] = React.useState([null, null]);
  const [totalAmount, settotalAmount] = useState(0);
  const { state } = useContext(ContextProvider);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    let newCat = findTotal(
      [...state.transactions],
      new Date(date[0]),
      new Date(date[1])
    );

    const newCatList = Object.keys(newCat)
      .filter((e) => newCat[`${e}`] !== 0)
      .filter((e) => e !== INCOME);

    const totalAmt = newCatList.reduce((total = 0, e) => {
      total += newCat[`${e}`];
      return total;
    }, 0);

    settotalAmount(totalAmt);
    setCategories(newCat);
  }, [state.transactions, date]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography align="left">
        <b>Total Expenses</b>
        <Calender setDate={setDate} />
      </Typography>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={7}>
          <DoughnutChart
            style={{ height: "300px", width: "100%" }}
            date={date}
            categories={categories}
            totalAmount={totalAmount}
          />
        </Grid>
        <Grid item xs={3}>
          <BasicTable
            date={date}
            categories={categories}
            totalAmount={totalAmount}
          />
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Paper>
  );
};

export default TotalExpense;
