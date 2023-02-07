import { useSelector } from "react-redux";
import TransactionsTable from "../Components/TransactionsTable";

const Transactions = () => {
  const transactions = useSelector((state) => state.user.transactions);
  return (
    <TransactionsTable
      noOfTransactions={transactions.length}
      title="All Transactions"
    />
  );
};

export default Transactions;
