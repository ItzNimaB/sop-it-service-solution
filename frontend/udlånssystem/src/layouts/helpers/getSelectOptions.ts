import { getData } from "@/data";

export async function getSelectOptions(
  fields: Field[],
  setFields: React.Dispatch<React.SetStateAction<Field[]>>,
) {
  for (let field of fields) {
    if (field.type == "select" && typeof field.options == "string") {
      field.options = await getData<any>(field.options);
      setFields((prev) => [...prev]);
    }
  }

  setFields(fields);
}
