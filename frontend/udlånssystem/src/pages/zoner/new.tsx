import NewLayout from "@/layouts/new";

import { fields } from "./util";

export default function New() {
  return <NewLayout table="zones" fields={fields} />;
}
