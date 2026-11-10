import { useEffect, useRef } from "react";

import axios from "axios";

import { isSessionError } from "@/services/session";

export default function useRealtimeLogout(
  currentUser: userState | undefined,
  onExpire: () => void,
) {
  const isLoggedIn = useRef(false);
  isLoggedIn.current = !!currentUser;

  useEffect(() => {
    if (!currentUser?.exp) return;

    const timeUntilExpire = currentUser.exp * 1000 - Date.now();

    const expireTimeout = setTimeout(onExpire, Math.max(timeUntilExpire, 0));

    return () => {
      clearTimeout(expireTimeout);
    };
  }, [currentUser]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const url: string = error?.config?.url ?? "";
        const { status, data } = error?.response ?? {};

        if (
          isLoggedIn.current &&
          !url.startsWith("auth/") &&
          isSessionError(status, data)
        ) {
          isLoggedIn.current = false;
          onExpire();
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
}
