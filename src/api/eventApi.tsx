import { api } from "./axios";

export const getContainerEvents = (
  containerId: string
) =>
  api.get(
    `/containers/${containerId}/events`
  );

export const createContainerEvent = (
  containerId: string,
  payload: {
    event_type: string;
    status: string;
  }
) => {
  return api.post(
    `/containers/${containerId}/events`,
    payload
  );
};