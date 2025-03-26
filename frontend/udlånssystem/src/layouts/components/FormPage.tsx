import { Combobox } from "@/components/Combobox";
import TextQuestion from "@/components/textQuestion";

interface FormPageProps {
  fields: Field[];
  exportData: any;
  setExportData?: any;
  editMode?: boolean;
  formSlot?: React.ReactElement;
}

export default function FormPage({
  fields,
  exportData = {},
  setExportData,
  editMode = true,
  formSlot = <></>,
}: FormPageProps) {
  return (
    <div className="form">
      <form>
        {fields.map((field, i) => {
          if (field.type == "text" || field.type == "number")
            return (
              <TextQuestion
                key={i}
                value={exportData[field.binding] || undefined}
                setValue={(value) =>
                  setExportData((prev: any) => {
                    prev[field.binding] = value;
                    return { ...prev };
                  })
                }
                editMode={editMode}
                {...field}
              />
            );

          if (field.type == "select" && typeof field.options == "object") {
            let option = undefined;

            if (field.options && typeof field.options != "string") {
              option = field.options.find(
                (opt) => opt.UUID == exportData[field.binding],
              );
            }

            return (
              <Combobox
                key={i}
                setValue={(value) =>
                  setExportData((prev: any) => {
                    prev[field.binding] = value.UUID;
                    return prev;
                  })
                }
                match={option}
                editMode={editMode}
                popoverWidth="43.75rem"
                {...field}
                options={field?.options}
              />
            );
          }
        })}
        {formSlot}
      </form>
    </div>
  );
}
