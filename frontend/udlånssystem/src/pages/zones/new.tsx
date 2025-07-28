import NewLayout from "@/layouts/new";

import { getFields } from "./util";

export default function New() {
  return <NewLayout table="zones" fields={getFields()} />;
}
