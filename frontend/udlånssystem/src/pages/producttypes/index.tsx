import { useTranslation } from "react-i18next";

import Layout from "@/layouts/index";
import type { Product } from "@prisma";
import { format } from "date-fns";
import { da } from "date-fns/locale";

// TODO: use correct locale
function formatter(value: Date) {
  return value ? format(value, "PPPp", { locale: da }) : value;
}

export default function Index() {
  const { t } = useTranslation();

  const fields: TableField<Product>[] = [
    { label: t("Id"), binding: "id" },
    { label: t("Name"), binding: "name" },
    { label: t("Date created"), binding: "created_at", formatter },
  ];

  return <Layout table="products" fields={fields} />;
}
