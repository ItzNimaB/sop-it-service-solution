import EditLayout from "@/layouts/edit";

import { getFields } from "./util";

export default function Edit() {
  return <EditLayout table="zones" fields={getFields()} />;
}
