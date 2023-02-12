import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TransactionsTable from "../Components/TransactionsTable";
import { apiCall } from "../redux/createAsyncThunk";
import { home } from "../redux/slices/userSlice";
import { GET_HOME_DATA_URL } from "../services/endpoints";

const Transactions = ({ openTransactionModal, setOpenTransactionModal }) => {
  const transactions = useSelector((state) => state.user.transactions);
  const token = useSelector((state) => state.user.token);
  const state = useSelector((state) => state);

  const navigate = useNavigate();
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
          console.log("Transaction Dispatch was successful");
        } else if (signUp.meta.requestStatus === "rejected") {
          console.log("Transaction Dispatch failed");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      fetchHomedata();
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
    <TransactionsTable
      noOfTransactions={transactions.length}
      title="All Transactions"
      openTransactionModal={openTransactionModal}
      setOpenTransactionModal={setOpenTransactionModal}
    />
  );
};

export default Transactions;
