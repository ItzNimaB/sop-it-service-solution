import { autoGenZodSchema } from "@/services/autoGen";

import type { Product } from "@prisma";
import { t } from "i18next";

export const getFields = (): Field<Product>[] => [
  {
    label: t("Name"),
    binding: "name",
  },
  {
    label: t("Brand"),
    binding: "brand_id",
    type: "select",
    options: "brands",
  },
  {
    label: t("Category"),
    binding: "category_id",
    type: "select",
    options: "categories",
  },
  {
    label: t("Barcode Prefix"),
    binding: "product_id_prefix",
    required: false,
  },
];

export const zodSchema = autoGenZodSchema(getFields());
