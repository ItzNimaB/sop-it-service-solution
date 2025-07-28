import { t } from "i18next";
import { z } from "zod";

export function autoGenZodSchema(fields: Field[]): z.ZodObject<any> {
  let zodSchema = {} as any;

  for (let field of fields) {
    let zodType: z.ZodType<any, any> = z.any();

    const defaultOptions = {
      description: field.label,
      message: t("field required", field.label),
    };

    if (!field?.type) field.type = "text";
    if (field.required === undefined) field.required = true;

    const min = field.required ? 1 : 0;

    switch (field.type) {
      case "text":
        zodType = z
          .string(defaultOptions)
          .trim()
          .min(min, defaultOptions.message);
        break;
      case "number":
        zodType = z
          .number(defaultOptions)
          .int(t("must be a integer", field.label))
          .min(0, t("must be a positive integer", field.label));
        break;
      case "select":
        zodType = z.number(defaultOptions).int();
        break;
    }

    if (!field.required) zodType = zodType.nullish();

    zodSchema[field.binding] = zodType;
  }

  return z.object(zodSchema);
}
