import { useEffect, useState } from "react";

import getData from "@/data/getData";

export default function useData<T>(
  url: string,
  id?: number | string,
): [T | null, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    setData(await getData<T>(url, id));

    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  return [data, setData, isLoading];
}
