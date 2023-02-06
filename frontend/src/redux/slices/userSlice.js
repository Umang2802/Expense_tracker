import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: {
    username: "",
    email: "",
    profileImage: "",
    inflow: null,
    outflow: null,
    loggedIn: false,
  },
  transactions: [],
  accounts: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    home: (state, action) => {
      state.user = action.payload.user;
      state.transactions = action.payload.transactions;
      state.accounts = action.payload.accounts;
    },
    user_info: (state, action) => {
      state.user = action.payload.user;
    },
    user_register: (state, action) => {
      console.log(action);
      state.token = action.payload.token;
      state.user.loggedIn = true;
    },
    login: (state, action) => {
      console.log(action);
      state.token = action.payload.token;
      state.user.loggedIn = true;
    },
    logout: (state) => (state = initialState),
    user_update: (state, action) => {
      console.log(action);
      state.user.loggedIn = true;
    },
    add_account: (state, action) => {
      state.accounts = [...state.accounts, action.payload.account];
    },
    add_transaction: (state, action) => {
      state.transactions = [...state.transactions, action.payload.transaction];
    },
  },
});

export const {
  home,
  user_register,
  login,
  logout,
  user_info,
  user_update,
  add_account,
  add_transaction,
} = userSlice.actions;

export default userSlice.reducer;
