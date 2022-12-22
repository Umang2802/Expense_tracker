import { CREDIT, SPENDING } from "./constants";

const transactions = [
  {
    date: "13-11-2022",
    category: "Groceries",
    account: "Cash",
    description: "Groceries",
    amount: "100",
    cashFlow: SPENDING,
  },
  {
    date: "15-11-2022",
    category: "Clothing",
    account: "HDFC",
    description: "Clothes Shopping MAX",
    amount: "100",
    cashFlow: SPENDING,
  },
  {
    date: "19-11-2022",
    category: "Food",
    account: "BOI",
    description: "Ritz Panjim",
    amount: "100",
    cashFlow: SPENDING,
  },
  {
    date: "1-11-2022",
    category: "Bills",
    account: "HDFC",
    description: "Mobile Recharge",
    amount: "100",
    cashFlow: SPENDING,
  },
  {
    date: "3-11-2022",
    category: "Electronics",
    account: "SBI",
    description: "Monitor",
    amount: "150",
    cashFlow: SPENDING,
  },
  {
    date: "6-11-2022",
    category: "Shopping",
    account: "HDFC",
    description: "Shopping",
    amount: "120",
    cashFlow: SPENDING,
  },
  {
    date: "8-11-2022",
    category: "Income",
    account: "HDFC",
    description: "Income",
    amount: "1200",
    cashFlow: CREDIT,
  },
];

export default transactions;
