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
      state.user.loggedIn = true;
      state.transactions = action.payload.transactions;
      state.accounts = action.payload.accounts;
    },
    info: (state, action) => {
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
    update: (state, action) => {
      console.log(action);
      state.user.loggedIn = true;
    },
  },
});

export const { user_register, login, info, home } = userSlice.actions;

export default userSlice.reducer;
