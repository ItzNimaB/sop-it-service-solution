import NewLayout from "@/layouts/new";

import { fields, zodSchema } from "./util";

export default function New() {
  return <NewLayout table="products" fields={fields} zodSchema={zodSchema} />;
}
