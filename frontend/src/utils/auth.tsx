export const TOKEN_KEY = "auth_token";
export const USER_KEY = "auth_user";

// Save token + user
export function setAuth(token: string, user: any, remember = false) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getUser(): any | null {
  const userData =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
