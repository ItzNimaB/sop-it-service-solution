import { type ComponentType, lazy } from "react";

const exclude = ["components", "Login", "Home"];

interface ReactComponent {
  default: ComponentType<any>;
}

export function getPages() {
  const allPages = import.meta.glob<ReactComponent>("../pages/**/*.tsx", {
    eager: true,
  });

  return Object.entries(allPages)
    .filter(([path]) => {
      for (const excludePath of exclude) {
        if (path.includes(excludePath)) return false;
      }

      return true;
    })
    .map(([path, { default: element }]) => {
      let name = path
        .replace("../pages/", "")
        .replace(".tsx", "")
        .replace("/index", "")
        .replace("edit", ":id")
        .replace(/\[([^\]]+)\]/g, ":$1");

      return { path: name.toLowerCase(), element };
    });
}
