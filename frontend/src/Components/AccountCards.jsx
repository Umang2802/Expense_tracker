import { Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import BasicCard from "./Card";
import AddIcon from "@mui/icons-material/Add";
import { ContextProvider } from "../Context";

const AccountCards = ({ accounts, setOpen }) => {
  const Context = useContext(ContextProvider);
  return (
    <>
      <Typography align="left" sx={{ mb: 1 }}>
        <b>Accounts</b>
        <span style={{ float: "right", fontSize: ".65rem" }}>
          * You can add atmost 4 accounts
        </span>
      </Typography>
      <Grid container spacing={2} justifyContent="left" sx={{ mb: 2 }}>
        {Context.state.accounts.map((item, index) => {
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
        {Context.state.accounts.length < 4 && (
          <Grid item xs={3}>
            <BasicCard
              amount={<AddIcon />}
              tag="Add Account"
              color="grey"
              onClick={() => setOpen(true)}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default AccountCards;
