import { useContext, useState } from "react";

import { loginViaCredentials, useLoginViaSession } from "@services/login";

import { CurrentUserContext } from "@/App";

import "@styles/loginPage.css";

export default function LoginPage() {
  const { setCurrentUser } = useContext(CurrentUserContext);

  useLoginViaSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessages, setErrorMessages] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();

    loginViaCredentials(username, password).then((res) => {
      if (res.status == 200 && res.user) setCurrentUser(res.user);
      if (res.status === 401)
        setErrorMessages("Forkert unilogin eller adgangskode");
      if (res.status === 403) setErrorMessages("Adgang nægtet");
      if (res.status === 500) setErrorMessages("Server problemer");
    });
  }
  function resetError() {
    setErrorMessages("");
  }

  function isErrClass() {
    return errorMessages ? " error " : " ";
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[#f5f5f5] p-[2rem_0rem] px-0 py-8">
      <div className="flex h-fit max-h-full w-[min(50%,_500px)] max-w-[700px] flex-col gap-4 rounded-3xl bg-white p-8 shadow-2xl">
        <form onSubmit={login} className="loginPage">
          <div className="flex w-full flex-col items-center justify-center">
            <h1 className="mb-[10px] font-normal tracking-[0.01em] text-[#303033]">
              Velkommen tilbage
            </h1>

            {errorMessages && <p className="errorMessage">{errorMessages}</p>}
          </div>

          <div className="question mt-[20px]">
            <input
              onFocus={resetError}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={"text" + isErrClass()}
              type="text"
              name="username"
              required
            />
            <label className={isErrClass()}>Uni-login</label>
          </div>
          <div className={"question" + isErrClass()}>
            <input
              onFocus={resetError}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={"text" + isErrClass()}
              type="password"
              name="password"
              required
            />
            <label className={isErrClass()}>Adgangskode</label>
          </div>
          <div className="flex w-full justify-center">
            <button>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
