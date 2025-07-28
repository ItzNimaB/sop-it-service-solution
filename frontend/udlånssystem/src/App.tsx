import { Suspense, createContext, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { Outlet, Route, Routes } from "react-router-dom";

import Loading from "@/components/loading";
import Nav from "@/components/nav";
import Breadcrumbs from "@/components/breadcrumbs";
import { Toaster } from "@/components/ui/sonner";

import Error404 from "@/pages/Error404";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import loanReturn from "@/pages/loans/return";

import { getPages } from "@/helpers/routeHelpers";
import useRealtimeLogout from "@/hooks/useRealtimeLogout";

import i18n from "@/../i18n";

import "./axios.config";

export const CurrentUserContext = createContext<CurrentUserContextType>({
  currentUser: undefined,
} as CurrentUserContextType);

function Layout() {
  const [currentUser, setCurrentUser] = useState<userState>();

  useRealtimeLogout(currentUser);

  return (
    <I18nextProvider i18n={i18n}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser,
        }}
      >
        <Toaster theme="dark" closeButton position="bottom-center" />
        {currentUser ? (
          <div className="bg-base-100 grid h-screen grid-cols-[auto_1fr]">
            <header className="w-nav bg-nav h-screen">
              <Nav />
            </header>
            <main className="relative grid h-screen grid-rows-[50px_1fr] overflow-y-auto">
              <Breadcrumbs />

              <div className="h-full overflow-y-hidden">
                <Suspense fallback={<Loading />}>
                  <Outlet />
                </Suspense>
              </div>
            </main>
          </div>
        ) : (
          <Login />
        )}
      </CurrentUserContext.Provider>
    </I18nextProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route Component={Error404} />
        <Route path="/" Component={Home} />

        {getPages().map(({ path, element }, i) => (
          <Route key={i} path={path} Component={element} />
        ))}

        <Route path="udlaan/:id/returner" Component={loanReturn} />
      </Route>
    </Routes>
  );
}
