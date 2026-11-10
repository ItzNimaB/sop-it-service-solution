import EditLayout from "@/layouts/edit";

import { fields, zodSchema } from "./util";

export default function Edit() {
  return (
    <EditLayout table="departments" fields={fields} zodSchema={zodSchema} />
  );
}
