import { z } from "../../deps.ts";
import api from "../api/index.ts";
import { snapshotSchema } from "../schemas.ts";
import { snapshotFileLocation } from "../utils.ts";

export default async () => {
  console.log("Creating snapshot...");
  const { servers, meta: { pagination: { total_entries } } } = await api
    .servers();
  if (total_entries === 0) {
    throw new Error("No servers found");
  }
  const snapshot: z.infer<typeof snapshotSchema> = servers.reduce<
    z.infer<typeof snapshotSchema>
  >((acc, server) => {
    return [...acc, {
      id: server.id,
      name: server.name,
      _info: {
        type_name: server.server_type.name,
        cores: server.server_type.cores,
        memory: server.server_type.memory,
        disk: server.server_type.disk,
        arch: server.image.architecture,
        os_flavor: server.image.os_flavor,
      },
    }];
  }, []);

  Deno.writeTextFileSync(
    snapshotFileLocation,
    JSON.stringify(snapshot, null, 2) + "\n",
    { create: true },
  );

  console.log(snapshot);
};
