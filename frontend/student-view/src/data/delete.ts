import axios from "axios";
import { toast } from "sonner";

export default function deleteItem<T = any>(
  table: string,
  UUID: number,
  config = { withToast: true },
): Promise<T> {
  const promise = axios.delete<any, T>(`${table}/${UUID}`);

  if (config?.withToast) {
    toast.promise(promise, {
      id: "deleteItem" + UUID,
      loading: "Sletter...",
      success: "Slettet!",
    });
  }

  return promise;
}
