// Utility type for nested object keys, accounting for optional/nullable fields
// type NestedKeyOf<T> = {
//   [K in keyof T & string]: NonNullable<T[K]> extends Record<string, unknown>
//     ? `${K}` | `${K}.${NestedKeyOf<NonNullable<T[K]>>}`
//     : `${K}`
// }[keyof T & string];

type NestedKeyOf<T> = {
  [K in Extract<keyof T, string>]: NonNullable<T[K]> extends object
    ? `${K}` | `${K}.${NestedKeyOf<NonNullable<T[K]>>}`
    : `${K}`
}[Extract<keyof T, string>];

interface BaseField<T extends FieldType = any> {
  label: string;
  binding: NestedKeyOf<T>;
  required?: boolean;
  disabled?: boolean;
}

interface TextField<T extends FieldType = any> extends BaseField<T> {
  type?: "text" | "number" | "password";
}

interface SelectField<T extends FieldType = any> extends BaseField<T> {
  type: "select";
  options: { id: number; name: string }[] | string;
}

type Field<T extends FieldType = any> = TextField<T> | SelectField<T>;
type TableField<T extends FieldType = any> = BaseField<T> & {
  formatter?: (value: any) => string;
  enableFilter?: boolean;
}