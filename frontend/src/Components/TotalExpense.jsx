import { Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DoughnutChart from "./DoughnutChart";
import Calender from "./Calender";
import BasicTable from "./Table";
import Categories from "../data/Categories";
import { INCOME } from "../data/constants";
import { useSelector } from "react-redux";

const findTotal = (Transactions, startDate, endDate) => {
  let cat = { ...Categories };

  Transactions.filter((e) => e.cashFlow !== INCOME)
    .filter(
      (e) =>
        new Date(new Date(e.date).toDateString()) >= startDate &&
        new Date(new Date(e.date).toDateString()) <= endDate
    )
    .forEach((e) => {
      cat[`${e.category}`] += parseInt(e.amount);
    });

  return cat;
};

const TotalExpense = () => {
  const transactions = useSelector((state) => state.user.transactions);
  const [date, setDate] = React.useState([null, null]);
  const [totalAmount, settotalAmount] = useState(0);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    let newCat = findTotal(transactions, new Date(date[0]), new Date(date[1]));

    const newCatList = Object.keys(newCat)
      .filter((e) => newCat[`${e}`] !== 0)
      .filter((e) => e !== INCOME);

    const totalAmt = newCatList.reduce((total = 0, e) => {
      total += newCat[`${e}`];
      return total;
    }, 0);

    settotalAmount(totalAmt);
    setCategories(newCat);
  }, [transactions, date]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography align="left">
        <b>Total Expenses</b>
        <Calender setDate={setDate} />
      </Typography>
      {totalAmount === 0 ? (
        <Typography align="center" variant="h6" sx={{ p: 5 }}>
          {transactions.length === 0
            ? "No transactions"
            : "No transactions for selected dates"}
        </Typography>
      ) : (
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
      )}
    </Paper>
  );
};

export default TotalExpense;
