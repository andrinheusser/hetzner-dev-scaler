import { load } from "./../../deps.ts";

const env = await load();

export type ClientResponseOk = {
  ok: true;
  status: number;
  statusText: string;
  data: unknown;
};

export type ClientResponse = ClientResponseOk;

export default async (
  path: string,
  init?: RequestInit,
): Promise<ClientResponse> => {
  const apiKey = env["HDS_PROJECT_API_KEY"];
  if (!apiKey) {
    throw new Error("Environment variable HDS_PROJECT_API_KEY is not set");
  }
  const url = `https://api.hetzner.cloud/v1/${path}`;
  const headers = new Headers(init?.headers || {});
  headers.set("Authorization", `Bearer ${apiKey}`);
  if (init?.body) headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...init, headers });
  if (response.ok) {
    const data = await response.json();
    return {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      data,
    };
  }
  const text = await response.text();
  throw new Error(`Error fetching ${path}: ${response.statusText} ${text}`);
};
