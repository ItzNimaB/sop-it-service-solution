import axios from "axios";
import { toast } from "sonner";

export default function updateItem<T = any>(
  table: string,
  UUID: number,
  data: T,
  config = { withToast: true },
): Promise<T> {
  const promise = axios.patch<any, T>(`${table}/${UUID}`, { data });

  if (config?.withToast) {
    toast.promise(promise, {
      id: "updateItem" + UUID,
      loading: "Gemmer...",
      success: "Gemt!",
    });
  }

  return promise;
}
