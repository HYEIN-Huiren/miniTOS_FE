import axios from "axios";
import { message } from "antd";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
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
    const status = error?.response?.status;
    const data = error?.response?.data;

    const msg =
      data?.detail ||
      data?.message ||
      error.message ||
      "Unknown error";

    // 500 이상
    if (status >= 500) {
      message.error("Server Error: " + msg);
    } else {
      message.error(msg);
    }

    return Promise.reject(error);
  }
);