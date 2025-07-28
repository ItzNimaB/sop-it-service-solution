import axios from "axios";
import { t } from "i18next";
import { toast } from "sonner";

export default async function createItem<T = any>(
  table: string,
  data: T,
  config = { withToast: true },
): Promise<T> {
  const promise = axios.post<any, T>(table, data);

  if (config?.withToast) {
    toast.promise(promise, {
      id: "createItem",
      loading: t("Saving") + "...",
      success: t("Saved!"),
    });
  }

  return promise;
}
