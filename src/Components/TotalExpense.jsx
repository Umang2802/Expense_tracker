import { Grid, Paper, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DoughnutChart from "./DoughnutChart";
import Calender from "./Calender";
import BasicTable from "./Table";
import { ContextProvider } from "../Context";
import Categories from "../data/Categories";
// import { CREDIT } from "../data/constants";

const findTotal = (Transactions) => {
  Transactions.forEach((e, i) => {
    Categories[`${e.category}`] += parseInt(e.amount);
  });
  return Categories;
};

const TotalExpense = () => {
  const [date, setDate] = React.useState([null, null]);
  const [totalAmount, settotalAmount] = useState(0);
  const { state } = useContext(ContextProvider);

  const [categories, setCategories] = useState({});

  useEffect(() => {
    console.log("Second useeffect");
    let newCat = findTotal([...state.transactions]);
    // state.transactions.forEach((e, i) => {
    //   newCat[`${e.category}`] += parseInt(e.amount);
    // });

    const newCatList = Object.keys(newCat)
      .filter((e) => newCat[`${e}`] !== 0)
      .filter((e) => e !== "Income");

    const totalAmt = newCatList.reduce((total = 0, e) => {
      total += newCat[`${e}`];
      return total;
    }, 0);

    // console.log("something" + totalAmt);
    // console.log(newCat);
    settotalAmount(totalAmt);
    setCategories(newCat);
  }, [state.transactions]);

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
