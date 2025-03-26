interface DataWithHeaders<T = any> {
  data: T;
  headers: string[];
}

interface Config {
  UUID?: number | string;
  withHeaders?: boolean;
}
