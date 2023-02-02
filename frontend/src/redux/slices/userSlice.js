import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    token: "",
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
    info: (state, action) => {},
    user_register: (state, action) => {
      console.log(action);
      state.user.token = action.payload.token;
      state.user.loggedIn = true;
    },
    login: (state, action) => {
      console.log(action);
      state.user.token = action.payload.token;
      state.user.loggedIn = true;
    },
    update: (state) => {},
  },
});

export const { user_register, login } = userSlice.actions;

export default userSlice.reducer;
