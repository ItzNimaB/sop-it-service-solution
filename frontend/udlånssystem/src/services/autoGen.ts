import { z } from "zod";

export function autoGenZodSchema(fields: Field[]): z.ZodObject<any> {
  let zodSchema = {} as any;

  for (let field of fields) {
    let zodType: z.ZodType<any, any> = z.any();

    const defaultOptions = {
      description: field.label,
      message: `${field.label} er påkrævet`,
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
          .int(`${field.label} skal være et heltal`)
          .min(0, `${field.label} skal være et positivt heltal`);
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
