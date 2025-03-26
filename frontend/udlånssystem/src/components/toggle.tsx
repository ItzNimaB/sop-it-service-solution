import { useEffect, useState } from "react";

import "@/styles/toggle.css";

export default function Toggle() {
  const [darkmode, setDarkmode] = useState(
    localStorage.getItem("theme") == "dark",
  );

  function setTheme(theme: "dark" | "light") {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
    setDarkmode(theme === "dark");
  }

  function toggleTheme(darkmode: boolean) {
    setTheme(darkmode ? "dark" : "light");
  }

  useEffect(() => {
    toggleTheme(darkmode);
  }, []);

  return (
    <>
      <input
        id="switch"
        type="checkbox"
        className="toggle hidden h-0 w-0"
        checked={darkmode}
        onChange={(e) => toggleTheme(e.target.checked)}
      />
      <label className="toggle" htmlFor="switch">
        Toggle
      </label>
    </>
  );
}
