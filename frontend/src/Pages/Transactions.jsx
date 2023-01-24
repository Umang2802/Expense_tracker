import React, { useContext } from "react";
import TransactionsTable from "../Components/TransactionsTable";
import { ContextProvider } from "../Context";

const Transactions = () => {
  const { state } = useContext(ContextProvider);
  const { transactions } = state;
  return (
    <TransactionsTable
      noOfTransactions={transactions.length}
      title="All Transactions"
    />
  );
};

export default Transactions;
