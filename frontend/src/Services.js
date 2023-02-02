import axios from "axios";
import { LOGIN_URL } from "./services/endpoints";

const baseURL = "http://localhost:5000";

const instance = axios.create({
  // .. congigure axios baseURL
  baseURL: `${baseURL}`,
});

export const login = (params) => instance.post(LOGIN_URL, params);

export const home = () => instance.get("/");
