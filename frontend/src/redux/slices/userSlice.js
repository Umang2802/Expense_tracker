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
      state.accounts = action.payload.accounts;
      state.transactions = action.payload.transactions;
    },
    user_register: (state, action) => {
      state.user = action.payload.user;
      state.user.loggedIn = true;
      state.token = action.payload.token;
      state.accounts = action.payload.accounts;
    },
    login: (state, action) => {
      state.user = action.payload.user;
      state.user.loggedIn = true;
      state.token = action.payload.token;
      state.accounts = action.payload.accounts;
      state.transactions = action.payload.transactions;
    },
    logout: (state) => (state = initialState),
    user_email: (state) => {},
  },
});

export const { home, user_register, login, logout, user_email } =
  userSlice.actions;

export default userSlice.reducer;
