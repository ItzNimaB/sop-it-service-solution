import axios from "axios";
import { t } from "i18next";
import { toast } from "sonner";

export default function deleteItem<T = any>(
  table: string,
  id: string | number,
  config = { withToast: true },
): Promise<T> {
  const promise = axios.delete<any, T>(`${table}/${id}`);

  if (config?.withToast) {
    toast.promise(promise, {
      id: "deleteItem" + id,
      loading: t("Deleting") + "...",
      success: t("Deleted!"),
    });
  }

  return promise;
}
