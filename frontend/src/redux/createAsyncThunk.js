import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../services/endpoints";
import { success, error, pending } from "./slices/responseSlice";

const axiosConfig = axios.create({
  baseURL: `${baseURL}`,
});

export const apiCall = (params) =>
  createAsyncThunk(`user/${params.name}`, async (params, thunkAPI) => {
    console.log(params);
    try {
      thunkAPI.dispatch(pending());
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
      return res.data;
    } catch (err) {
      console.log(err.response.data.message);
      thunkAPI.dispatch(error(err.response.data.message));
    }
  })(params);
