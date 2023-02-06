import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../services/endpoints";
import { success, error, pending } from "./slices/responseSlice";

const axiosConfig = axios.create({
  baseURL: `${baseURL}`,
});

export const apiCall = (params) =>
  createAsyncThunk(
    `user/${params.name}`,
    async (
      params,
      { dispatch, getState, rejectWithValue, fulfillWithValue }
    ) => {
      console.log(params);
      try {
        dispatch(pending());
        const res = await axiosConfig({
          url: params.url,
          method: params.method,
          headers: {
            Authorization: params.token,
          },
          data: params.payload,
        });
        console.log(res);
        dispatch(params.name(res.data));
        dispatch(success(res.data.message));
        return fulfillWithValue(res.data);
      } catch (err) {
        console.log(err.response.data.message);
        const e = dispatch(error(err.response.data.message));
        console.log(e);
        throw rejectWithValue(err.response.data.message);
      }
    }
  )(params);
