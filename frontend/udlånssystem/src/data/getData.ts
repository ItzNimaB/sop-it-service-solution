import axios, { AxiosError } from "axios";
import { t } from "i18next";
import { toast } from "sonner";

export default async function getData<T>(
  table: string,
  id?: string | number | null,
): Promise<T | null> {
  if (id === null) return null;

  const url = table + (id ? "/" + id : "");

  const { data } = await axios.get<T>(url);

  if (!data) {
    toast.error(t("No data found"));
    return null;
  }

  return data;
}

function handleError(err: AxiosError) {
  if (err?.response?.status == 401) return t("You are not logged in");

  toast.error(t("Unknown error:") + " " + err);

  return { status: 500, data: null };
}
