import axios from "axios";
import { toast } from "sonner";

export default function updateItem<T = any>(
  table: string,
  id: number,
  data: T,
  config = { withToast: true },
): Promise<T> {
  const promise = axios.patch<any, T>(`${table}/${id}`, { data });

  if (config?.withToast) {
    toast.promise(promise, {
      id: "updateItem" + id,
      loading: "Gemmer...",
      success: "Gemt!",
    });
  }

  return promise;
}
