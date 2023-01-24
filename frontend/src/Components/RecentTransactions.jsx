import * as React from "react";
import TransactionsTable from "./TransactionsTable";

const RecentTransactions = () => {
  return <TransactionsTable noOfTransactions={5} title="Recent Transactions" />;
};

export default RecentTransactions;
