import { useAuthStore } from "../store/authStore";

export function useRole() {
  const user = useAuthStore((s) => s.user);
  return user?.role;
}

export function isViewer() {
  return useRole() === "VIEWER";
}

export function isOperator() {
  return useRole() === "OPERATOR";
}

export function isAdmin() {
  return useRole() === "ADMIN";
}