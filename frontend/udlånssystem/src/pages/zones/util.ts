import type { Zone } from "@prisma";
import { t } from "i18next";

export const getFields = (): Field<Zone>[] => [
  {
    label: t("Name"),
    binding: "name",
    type: "text",
  },
  {
    label: t("Building"),
    binding: "building_id",
    type: "select",
    options: "buildings",
  },
  {
    label: t("Floor"),
    binding: "floor_level",
    type: "number",
  },
];
