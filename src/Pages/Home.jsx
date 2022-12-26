import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "../Components/Sidebar";
import BasicCard from "../Components/Card";
import { Grid, Typography } from "@mui/material";
import TotalExpense from "../Components/TotalExpense";
import Modal from "../Components/AddAccountModal";
import NewTransactionModal from "../Components/NewTransactionModal";
import RecentTransactions from "../Components/RecentTransactions";
import AccountCards from "../Components/AccountCards";
import AddButton from "../Components/AddButton";
import { ContextProvider } from "../Context";

const drawerWidth = 240;

const Home = () => {
  const { state } = useContext(ContextProvider);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        bgcolor="#F0F8FF"
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <Typography align="left" sx={{ mb: 5 }} fontWeight={700} color="grey">
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
      </Box>
      <AddButton setOpenTransactionModal={setOpenTransactionModal} />
      <Modal open={open} setOpen={setOpen} />
      <NewTransactionModal
        openTransactionModal={openTransactionModal}
        setOpenTransactionModal={setOpenTransactionModal}
      />
    </Box>
  );
};

export default Home;
