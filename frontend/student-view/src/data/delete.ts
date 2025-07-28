import axios from "axios";
import { toast } from "sonner";

export default function deleteItem<T = any>(
  table: string,
  id: number,
  config = { withToast: true },
): Promise<T> {
  const promise = axios.delete<any, T>(`${table}/${id}`);

  if (config?.withToast) {
    toast.promise(promise, {
      id: "deleteItem" + id,
      loading: "Sletter...",
      success: "Slettet!",
    });
  }

  return promise;
}
