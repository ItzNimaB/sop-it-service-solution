const SESSION_EXPIRED_KEY = "sessionExpired";

export const SESSION_EXPIRED_MESSAGE = "Din session er udløbet. Log ind igen.";

const SESSION_ERRORS = ["Access denied", "Token expired", "Invalid token"];

export function isSessionError(status?: number, data?: any) {
  if (status !== 401 && status !== 400) return false;

  const error = typeof data === "string" ? data : data?.error;

  return SESSION_ERRORS.includes(error);
}

export function markSessionExpired() {
  try {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
  } catch { }
}

export function wasSessionExpired() {
  try {
    return sessionStorage.getItem(SESSION_EXPIRED_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearSessionExpired() {
  try {
    sessionStorage.removeItem(SESSION_EXPIRED_KEY);
  } catch { }
}
