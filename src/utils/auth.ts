import { jwtDecode } from "jwt-decode";

export function getToken(): string | null {
  return localStorage.getItem(
    "access_token"
  );
}

export function setToken(
  token: string
): void {
  localStorage.setItem(
    "access_token",
    token
  );
}

export function removeToken(): void {
  localStorage.removeItem(
    "access_token"
  );
}

// export function isAuthenticated(): boolean {
//   return !!getToken();
// }

export function getUsername():
  string | null {

  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const payload =
      jwtDecode<TokenPayload>(
        token
      );

    return payload.sub;
  } catch {
    return null;
  }
}