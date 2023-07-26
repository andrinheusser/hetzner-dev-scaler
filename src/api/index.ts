import { z } from "./../../deps.ts";
import action from "./action.ts";
import client from "./client.ts";
import { metaSchema, serverSchema, serverTypeSchema } from "./schemas.ts";

export const apiServersSchema = z.object({
  meta: metaSchema,
  servers: serverSchema.array(),
});

export const apiServerTypesSchema = z.object({
  server_types: serverTypeSchema.array(),
});

export const apiServerSchema = z.object({
  server: serverSchema,
});

const parsed = <T extends z.ZodTypeAny>(
  schema: T,
  path: string,
  init?: RequestInit,
) => {
  return async (): Promise<z.infer<T>> => {
    const response = await client(path, init);
    try {
      const data = schema.parse(response.data);
      return data;
    } catch (error) {
      console.log(response.data);
      throw error;
    }
  };
};

export default {
  "servers": parsed<typeof apiServersSchema>(apiServersSchema, "servers"),
  "server": (id: number) =>
    parsed<typeof apiServerSchema>(apiServerSchema, `servers/${id}`)(),
  "server_types": parsed<typeof apiServerTypesSchema>(
    apiServerTypesSchema,
    "server_types",
  ),
  "shutdown": (id: number) =>
    action(`servers/${id}/actions/shutdown`, { method: "POST" }),
  "power_on": (id: number) =>
    action(`servers/${id}/actions/poweron`, { method: "POST" }),
  "power_off": (id: number) =>
    action(`servers/${id}/actions/poweroff`, { method: "POST" }),
  "rescale": (id: number, server_type: string) =>
    action(`servers/${id}/actions/change_type`, {
      method: "POST",
      body: JSON.stringify({ server_type, upgrade_disk: false }),
    }),
};
