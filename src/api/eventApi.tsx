import { api } from "./axios";

export const getContainerEvents = (
  containerId: string
) =>
  api.get(
    `/containers/${containerId}/events`
  );