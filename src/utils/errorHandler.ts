import { message, Modal } from "antd";
import axios from "axios";

export const handleApiError = (error: any) => {
  console.error("API ERROR:", error);

  // Axios 에러일 경우
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    const msg =
      data?.detail ||
      data?.message ||
      error.message ||
      "Unknown error";

    // 500급은 Modal
    if (status && status >= 500) {
      Modal.error({
        title: "Server Error",
        content: msg,
      });
      return;
    }

    // 400~499는 message
    message.error(msg);
    return;
  }

  // 기타 에러
  message.error("Unexpected error occurred");
};