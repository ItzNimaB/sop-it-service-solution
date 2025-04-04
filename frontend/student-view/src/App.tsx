import { Suspense, createContext, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import Loading from "@/components/Loading";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/sonner";

import Error404 from "@/pages/Error404";
import Home from "@/pages/Home";
import Login from "@/pages/Login";

import { getPages } from "@/helpers/routeHelpers";
import useRealtimeLogout from "@/hooks/useRealtimeLogout";

import { ThemeProvider } from "@/providers/ThemeProvider";

import "./axios.config";

export const CurrentUserContext = createContext<CurrentUserContextType>({
  currentUser: undefined,
} as CurrentUserContextType);

function Layout() {
  const [currentUser, setCurrentUser] = useState<userState>();

  useRealtimeLogout(currentUser);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster theme="dark" closeButton position="bottom-center" />
        {currentUser ? (
          <div className="bg-base-100 grid h-screen grid-cols-[auto_1fr]">
            <header className="w-nav bg-nav h-screen">
              <Nav />
            </header>
            <main className="relative h-screen overflow-y-auto">
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
      </ThemeProvider>
    </CurrentUserContext.Provider>
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
      </Route>
    </Routes>
  );
}
