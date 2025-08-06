import { Domain } from "./Domain";

export type Client = {
  client_id: number;
  ip: string;
  name: string | null;
  domains: Domain[];
};