import axios from "axios";
import { message } from "antd";
import { getToken, removeToken } from "../utils/auth";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * - token 자동 첨부
 * - payload 정리 (null / undefined 제거)
 */
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // request data cleanup
    if (config.data && typeof config.data === "object") {
      Object.keys(config.data).forEach((key) => {
        const value = config.data[key];

        if (value === undefined || value === null) {
          delete config.data[key];
        }
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - 401 → 자동 로그아웃
 * - 500+ → 서버 에러 처리
 * - 기타 → message 표시
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    const msg =
      data?.detail ||
      data?.message ||
      error.message ||
      "Unknown error";

    // Unauthorized → logout
    if (status === 401) {
      removeToken();
      message.error("Session expired. Please login again.");
      window.location.href = "/";
      return Promise.reject(error);
    }

    // Server error
    if (status >= 500) {
      message.error(`Server Error: ${msg}`);
      return Promise.reject(error);
    }

    // Other errors
    message.error(msg);

    return Promise.reject(error);
  }
);