import { useContext, useEffect } from "react";

import { CurrentUserContext } from "@/App";
import axios from "axios";
import { t } from "i18next";
import { toast } from "sonner";

export const validateSession = async () => {
  let { data } = await axios.post("auth/validate").catch((err) => {
    err.response.data.user = null;
    return err.response;
  });

  data.user = data;
  return data;
};

export function useLoginViaSession() {
  const { setCurrentUser } = useContext(CurrentUserContext);

  async function loginViaSession() {
    let { data } = await axios.get("auth/cookies");

    const { token } = data;

    if (!token) {
      setCurrentUser(null);
      return false;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    let res = await validateSession();

    if (res && !res.error && res.user.moderatorLevel > 0) {
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

export async function loginViaCredentials(username: string, password: string) {
  let output = { status: 500, message: "Server error", user: undefined };
  await axios
    .post("auth/login", { username, password })
    .then((res) => {
      output.message = res.data;
      if (res.data.moderatorLevel == 0) {
        output.status = 403;
        return output;
      }

      if (res.data?.username) {
        output.user = res.data;
        output.status = 200;
      }
    })
    .catch((err) => {
      toast.error(t("Unknown error") + " " + err);
    });
  return output;
}
export function logout(
  setCurrentUser: React.Dispatch<React.SetStateAction<userState>>,
) {
  axios.post("auth/logout");

  axios.defaults.headers.common["Authorization"] = "";

  setCurrentUser(null);
}
