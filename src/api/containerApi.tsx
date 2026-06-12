import { api } from "./axios";

export const createContainer = (data: any) =>
  api.post("/containers", data);

export const getContainers = () =>
  api.get("/containers");

export const getContainer = (id: string) =>
  api.get(`/containers/${id}`);

export const updateContainerStatus = (
  id: string,
  status: string
) =>
  api.patch(`/containers/${id}/status`, {
    status,
  });

export const deleteContainer = (id: string) =>
  api.delete(`/containers/${id}`);