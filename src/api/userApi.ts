import { api } from "./axios";

export interface User {
  id: number;
  username: string;
  role: string;
}

export const getUsersApi = async () => {
  const res = await api.get<User[]>("/users");
  return res.data;
};

export const createUserApi = async (data: {
  username: string;
  password: string;
  role: string;
}) => {
  const res = await api.post("/users", data);
  return res.data;
};