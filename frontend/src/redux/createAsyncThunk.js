import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseURL } from "../services/endpoints";
import { success, error } from "./slices/responseSlice";

const axiosConfig = axios.create({
  baseURL: `${baseURL}`,
});

export const apiCall = (params) =>
  createAsyncThunk(`user/${params.name}`, async (params, thunkAPI) => {
    console.log(params);
    try {
      // const token = useSelector((state) => state.user.user.token);
      // console.log(token);
      const res = await axiosConfig({
        url: params.url,
        method: params.method,
        headers: {
          Authorization: params.token,
        },
        data: params.payload,
      });
      console.log(res);
      thunkAPI.dispatch(params.name(res.data));
      thunkAPI.dispatch(success(res.data.message));
    } catch (err) {
      console.log(err.response.data.message);
      thunkAPI.dispatch(error(err.response.data.message));
    }
  })(params);
