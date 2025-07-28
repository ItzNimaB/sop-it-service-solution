import fs from "fs";
import path from "path";

import { router } from "@/index";

export function importAllRoutes(ignore: string[] = []) {
  const routesPath = path.join(__dirname, "../api/routes");
  const files = fs.readdirSync(routesPath);

  const routeFiles = files.filter((file) => file.endsWith(".ts"));

  for (const file of routeFiles) {
    const name = path.basename(file, ".ts").replace(/\.route$/, "");
    if (ignore.includes(name)) continue;

    const route = require(path.join(routesPath, file));

    if (route.default) router.use(`/${name}`, route.default);
  }
}
