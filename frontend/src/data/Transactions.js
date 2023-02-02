import { INCOME, EXPENSE } from "./constants";

const transactions = [
  {
    date: "2022-11-13",
    category: "Groceries",
    account: "Cash",
    description: "Groceries",
    amount: "100",
    cashFlow: EXPENSE,
  },
  {
    date: "2022-11-15",
    category: "Clothing",
    account: "HDFC",
    description: "Clothes Shopping MAX",
    amount: "100",
    cashFlow: EXPENSE,
  },
  {
    date: "2022-11-19",
    category: "Food",
    account: "BOI",
    description: "Ritz Panjim",
    amount: "100",
    cashFlow: EXPENSE,
  },
  {
    date: "2022-11-1",
    category: "Bills",
    account: "HDFC",
    description: "Mobile Recharge",
    amount: "100",
    cashFlow: EXPENSE,
  },
  {
    date: "2022-11-3",
    category: "Electronics",
    account: "SBI",
    description: "Monitor",
    amount: "150",
    cashFlow: EXPENSE,
  },
  {
    date: "2022-11-6",
    category: "Shopping",
    account: "HDFC",
    description: "Shopping",
    amount: "120",
    cashFlow: EXPENSE,
  },
  {
    date: "2022-11-8",
    category: INCOME,
    account: "HDFC",
    description: "Income",
    amount: "1200",
    cashFlow: INCOME,
  },
];

export default transactions;
