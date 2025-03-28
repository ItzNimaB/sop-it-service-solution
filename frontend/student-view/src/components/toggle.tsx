import { useTheme } from "@/providers/ThemeProvider";

import "@/styles/toggle.css";

export default function Toggle() {
  const { theme, setTheme } = useTheme();

  function toggleTheme(darkmode: boolean) {
    setTheme(darkmode ? "dark" : "light");
  }

  return (
    <>
      <input
        id="switch"
        type="checkbox"
        className="toggle hidden h-0 w-0"
        checked={theme === "dark"}
        onChange={(e) => toggleTheme(e.target.checked)}
      />
      <label className="toggle" htmlFor="switch">
        Toggle
      </label>
    </>
  );
}
