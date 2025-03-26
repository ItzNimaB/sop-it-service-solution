import { autoGenZodSchema } from "@/services/autoGen";

export const fields: Field<productModel>[] = [
  {
    label: "Navn",
    binding: "name",
  },
  {
    label: "Brand",
    binding: "brand_id",
    type: "select",
    options: "brands",
  },
  {
    label: "Kategori",
    binding: "category_id",
    type: "select",
    options: "categories",
  },
  {
    label: "Stregkode prefix",
    binding: "product_id_prefix",
    required: false,
  },
];

export const zodSchema = autoGenZodSchema(fields);
