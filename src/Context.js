import amountArray from "./data/Amounts";
import Transactions from "./data/Transactions";
import { createContext, useReducer } from "react";
import {
  ADD_ACCOUNT,
  ADD_TRANSACTION,
  BALANCE,
  CREDIT,
  SPENDING,
  TRANSACTION,
} from "./data/constants";

export const ContextProvider = createContext();

const Credit = (args) =>
  args.reduce((totalamount = 0, item) => {
    if (item.cashFlow === CREDIT) return totalamount + parseInt(item.amount);
    else return totalamount;
  }, 0);

const Spending = (args) =>
  args.reduce((totalamount = 0, item) => {
    if (item.cashFlow === SPENDING) return totalamount + parseInt(item.amount);
    else return totalamount;
  }, 0);

const newCashFlow = (transactions, cashFlows) => {
  const credit = Credit(transactions);
  const spending = Spending(transactions);
  return cashFlows.map((item, i) => {
    if (item.tag === CREDIT) return { ...item, amount: credit };
    else if (item.tag === SPENDING) return { ...item, amount: spending };
    else if (item.tag === BALANCE)
      return { ...item, amount: credit - spending };
    else return { ...item, amount: transactions.length };
  });
};

const newCashFlowAfterTransaction = (
  cashFlow,
  tag,
  newAmount,
  noOfTransactions
) => {
  if (tag === CREDIT) {
    return cashFlow.map((item, i) => {
      if (item.tag === CREDIT)
        return { ...item, amount: parseInt(item.amount) + parseInt(newAmount) };
      else if (item.tag === BALANCE)
        return { ...item, amount: parseInt(item.amount) + parseInt(newAmount) };
      else if (item.tag === TRANSACTION)
        return { ...item, amount: noOfTransactions };
      else return item;
    });
  } else {
    return cashFlow.map((item, i) => {
      if (item.tag === SPENDING)
        return { ...item, amount: parseInt(item.amount) + parseInt(newAmount) };
      else if (item.tag === BALANCE)
        return { ...item, amount: parseInt(item.amount) - parseInt(newAmount) };
      else if (item.tag === TRANSACTION)
        return { ...item, amount: noOfTransactions };
      else return item;
    });
  }
};

const initialState = {
  cashFlow: newCashFlow(Transactions, amountArray),
  transactions: Transactions,
  accounts: [{ amount: "1200", tag: "Cash", color: "red" }],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_TRANSACTION:
      const newAccounts = state.accounts.map((item, i) => {
        if (payload.account === item.tag)
          return payload.cashFlow === CREDIT
            ? {
                ...item,
                amount: parseInt(item.amount) + parseInt(payload.amount),
              }
            : {
                ...item,
                amount: parseInt(item.amount) - parseInt(payload.amount),
              };
        return item;
      });

      return {
        ...state,
        cashFlow: newCashFlowAfterTransaction(
          state.cashFlow,
          payload.cashFlow,
          payload.amount,
          state.transactions.length + 1
        ),
        transactions: [...state.transactions, payload],
        accounts: newAccounts,
      };

    case ADD_ACCOUNT:
      return {
        ...state,
        cashFlow: newCashFlowAfterTransaction(
          state.cashFlow,
          CREDIT,
          payload.amount,
          state.transactions.length
        ),
        accounts: [...state.accounts, payload],
      };

    default:
      return state;
  }
};

function Context({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ContextProvider.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </ContextProvider.Provider>
  );
}

export default Context;
