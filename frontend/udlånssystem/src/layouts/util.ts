import { t } from "i18next";

export const getDefaultFields = (): Field[] => [
  { label: t("Name"), binding: "name" },
];

export const getDefaultTableFields = (): TableField[] => [
  { label: t("Id"), binding: "id" },
  { label: t("Name"), binding: "name" },
];
