export type Cookie = {
  name: string;
  value: string;
  path: string;
  expiration: string;
  http_only: boolean;
  secure: boolean;
  same_site: string;
  session: boolean;
  host_only: boolean;
  store_id: string;
};