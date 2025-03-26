import { useEffect, useState } from "react";

import getData from "@/data/getData";

export default function useData<T>(
  url: string,
  config: Config & { withHeaders: true },
  id?: number | string,
): [
  DataWithHeaders<T> | null,
  React.Dispatch<React.SetStateAction<DataWithHeaders<T> | null>>,
  boolean,
];

export default function useData<T>(
  url: string,
  config?: Config & { withHeaders?: false },
  id?: number | string,
): [T | null, React.Dispatch<React.SetStateAction<T | null>>, boolean];

export default function useData<T>(
  url: string,
  config = {} as Config,
  id?: number | string,
): [T | null, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    if (id) config.UUID = id;

    if (Object.keys(config).length === 0) config = undefined as any;

    const temp = await getData<T>(url, config as any);

    setData(temp);

    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  return [data, setData, isLoading];
}
