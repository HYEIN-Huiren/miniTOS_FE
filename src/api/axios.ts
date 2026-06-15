import axios from "axios";
import { message } from "antd";
import {getToken} from "../utils/auth"
import { removeToken } from "../utils/auth";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  if (config.data && typeof config.data === "object") {
    Object.keys(config.data).forEach((key) => {
      const value = config.data[key];

      if (value === undefined || value === null) {
        delete config.data[key];
      }
    });
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status =
      error?.response?.status;

    const data =
      error?.response?.data;

    const msg =
      data?.detail ||
      data?.message ||
      error.message ||
      "Unknown error";

    if (status === 401) {
      removeToken();

      window.location.href = "/";
    }

    if (status >= 500) {
      message.error(
        "Server Error: " + msg
      );
    } else if (status !== 401) {
      message.error(msg);
    }

    return Promise.reject(error);
  }
);