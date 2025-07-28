import NewLayout from "@/layouts/new";

import { getFields, zodSchema } from "../util";

export default function New() {
  return (
    <NewLayout
      table="items"
      fields={getFields()}
      zodSchema={zodSchema}
      redirectOnCreate={false}
    />
  );
}
