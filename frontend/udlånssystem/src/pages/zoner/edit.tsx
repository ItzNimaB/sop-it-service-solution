import EditLayout from "@/layouts/edit";

import { fields } from "./util";

export default function Edit() {
  return <EditLayout table="zones" fields={fields} />;
}
