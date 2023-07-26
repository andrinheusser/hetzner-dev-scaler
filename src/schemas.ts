import { z } from "../deps.ts";

export const snapshotSchema = z.object({
  name: z.string(),
  id: z.number(),
  _info: z.object({
    arch: z.string(),
    os_flavor: z.string(),
    cores: z.number(),
    memory: z.number(),
    disk: z.number(),
    type_name: z.string(),
  }),
}).array();
