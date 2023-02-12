import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import TotalExpense from "../Components/TotalExpense";
import Modal from "../Components/AddAccountModal";
import RecentTransactions from "../Components/RecentTransactions";
import AccountCards from "../Components/AccountCards";
import AddButton from "../Components/AddButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CashFlowCards from "../Components/CashFlowCards";
import { apiCall } from "../redux/createAsyncThunk";
import { home } from "../redux/slices/userSlice";
import { GET_HOME_DATA_URL } from "../services/endpoints";
import TransactionModal from "../Components/Transaction/TransactionModal";

const Home = ({ openTransactionModal, setOpenTransactionModal }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHomedata = async () => {
      try {
        const signUp = await dispatch(
          apiCall({
            url: GET_HOME_DATA_URL,
            method: "GET",
            name: home,
            token: token,
          })
        );
        console.log(signUp);

        if (signUp.meta.requestStatus === "fulfilled") {
          console.log("Home Dispatch was successful");
        } else if (signUp.meta.requestStatus === "rejected") {
          console.log("Home Dispatch failed");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      fetchHomedata();
    } else {
      navigate("/login");
    }
  }, [token, dispatch, navigate]);

  useEffect(() => {
    if (
      state.response.message === "Authorization denied" ||
      state.response.message === "Session expired"
    ) {
      navigate("/login");
    }
  }, [state.response.message, navigate]);

  useEffect(() => {
    if (!state.user.user.username) {
      navigate("/login");
    }
  }, [state.user.user.username, navigate]);

  return (
    <>
      <Typography align="left" sx={{ mb: 3 }} color="grey">
        Dashboard
      </Typography>
      <CashFlowCards />
      <AccountCards setOpen={setOpen} />
      <TotalExpense />
      <RecentTransactions />
      <AddButton setOpenTransactionModal={setOpenTransactionModal} />
      <Modal open={open} setOpen={setOpen} />
      <TransactionModal
        openTransactionModal={openTransactionModal}
        setOpenTransactionModal={setOpenTransactionModal}
        modalName="add"
      />
    </>
  );
};

export default Home;
