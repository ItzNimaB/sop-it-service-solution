import NewLayout from "@/layouts/new";

import { fields, zodSchema } from "../util";

export default function New() {
  return (
    <NewLayout
      table="items"
      fields={fields}
      zodSchema={zodSchema}
      redirectOnCreate={false}
    />
  );
}
