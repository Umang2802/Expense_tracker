import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import DoughnutChart from "./DoughnutChart";
import BasicTable from "./Table";

const TotalExpense = ({ Categories }) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography align="left">
        <b>Total Expenses</b>
      </Typography>
      <Typography align="left" fontSize="small">
        1 Jan - 30 Jan
      </Typography>
      <Grid container justifyContent="space-evenly">
        <Grid item xs={7}>
          <DoughnutChart style={{ height: "300px", width: "100%" }} />
        </Grid>
        <Grid item xs={3}>
          <BasicTable />
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Paper>
  );
};

export default TotalExpense;
