import axios from "axios";
import { t } from "i18next";
import { toast } from "sonner";

export default function updateItem<T = any>(
  table: string,
  id: string | number,
  data: T,
  config = { withToast: true },
): Promise<T> {
  const promise = axios.patch<any, T>(`${table}/${id}`, data);

  if (config?.withToast) {
    toast.promise(promise, {
      id: "updateItem" + id,
      loading: t("Saving") + "...",
      success: t("Saved!"),
    });
  }

  return promise;
}
