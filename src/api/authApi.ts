import { api } from "./axios";

export interface MeResponse {
  id: number;
  username: string;
  role: string;
}

// 로그인
export const loginApi = (data: {
  username: string;
  password: string;
}) => {
  return api.post("/auth/login", data);
};

// 내 정보
export const getMeApi = () => {
  return api.get<MeResponse>("/auth/me");
};