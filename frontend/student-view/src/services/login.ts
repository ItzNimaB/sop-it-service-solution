import { useContext, useEffect } from "react";

import { CurrentUserContext } from "@/App";
import axios from "axios";
import { toast } from "sonner";

//validate session token
export const validateSession = async () => {
  let { data } = await axios.post("auth/validate").catch((err) => {
    err.response.data.user = null;
    return err.response;
  });

  data.user = data;
  return data;
};

//login user
export function useLoginViaSession() {
  const { setCurrentUser } = useContext(CurrentUserContext);

  async function loginViaSession() {
    let { data } = await axios.get("auth/cookies");

    const { token } = data;

    if (!token) {
      setCurrentUser(null);
      return false;
    }

    let res = await validateSession();

    if (res && !res.error) {
      setCurrentUser(res.user);
      return true;
    } else {
      setCurrentUser(null);
      return false;
    }
  }

  useEffect(() => {
    loginViaSession();
  }, []);

  return { loginViaSession };
}

export async function loginViaCredentials(
  username: string,
  password: string,
  callback: (user: any) => void = () => {},
) {
  const loginPromise = axios.post("auth/login", { username, password });

  toast.promise(loginPromise, {
    loading: "Logger ind...",
    success: (res) => `Logget ind som ${res.data.username}`,
    error: (err) => err.response.statusText,
  });

  const { data } = await loginPromise;

  callback(data);

  return data;
}
export function logout(
  setCurrentUser: React.Dispatch<React.SetStateAction<userState>>,
) {
  axios.post("auth/logout");

  setCurrentUser(null);
}
