import axios from "axios";
import { toast } from "sonner";

const defaultConfig: Config = {
  UUID: undefined,
  withHeaders: false,
};

export default async function getData<T>(
  table: string,
  config: Config & { withHeaders: true },
): Promise<DataWithHeaders<T> | null>;

export default async function getData<T>(
  table: string,
  config?: Config & { withHeaders?: false },
): Promise<T | null>;

export default async function getData<T>(
  table: string,
  config = defaultConfig,
): Promise<T | DataWithHeaders<T> | null> {
  if (config.UUID === null) return null;

  const { data }: { data: DataWithHeaders } = await axios
    .get(table + (config.UUID ? "/" + config.UUID : ""))
    .catch(handleError);

  if (config.withHeaders) return data as DataWithHeaders<T>;

  if (config.withHeaders === false) {
    const dataWithoutHeader = data?.data;

    if (dataWithoutHeader) return dataWithoutHeader;
    return data as T;
  }

  return data as T;
}

function handleError(err: any) {
  if (err.response.status == 401) return "Du er ikke logget ind";

  toast.error("Ukendt fejl " + err);

  return err;
}
