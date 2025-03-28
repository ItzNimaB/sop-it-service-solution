import { useContext, useEffect } from "react";

export default function useRealtimeLogout(currentUser: userState | undefined) {
  useEffect(() => {
    if (!currentUser) return;

    const timeUntilExpire = currentUser.exp * 1000 - Date.now();

    const expireTimeout = setTimeout(() => {
      window.location.reload();
    }, timeUntilExpire + 1000);

    return () => {
      clearTimeout(expireTimeout);
    };
  }, [currentUser]);
}
