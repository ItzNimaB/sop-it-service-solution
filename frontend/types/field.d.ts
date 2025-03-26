interface BaseField<T extends FieldType = any> {
  label: string;
  binding: keyof T;
  required?: boolean;
  disabled?: boolean;
}

interface TextField<T extends FieldType = any> extends BaseField<T> {
  type?: "text" | "number" | "password";
}

interface SelectField<T extends FieldType = any> extends BaseField<T> {
  type: "select";
  options: { UUID: number; name: string }[] | string;
}

type Field<T extends FieldType = any> = TextField<T> | SelectField<T>;

type FieldType =
  | brandModel
  | buildingModel
  | categoryModel
  | categoryGroupModel
  | itemModel
  | itemInLoanModel
  | loanModel
  | productModel
  | productStatusModel
  | storageLocationModel
  | userModel
  | zoneModel;
