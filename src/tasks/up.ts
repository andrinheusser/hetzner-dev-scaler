import api from "../api/index.ts";
import { snapshotSchema } from "../schemas.ts";
import { snapshotFileLocation } from "../utils.ts";
import poweroff from "./poweroff.ts";

export default async () => {
  const snapshot = snapshotSchema.parse(
    JSON.parse(Deno.readTextFileSync(snapshotFileLocation)),
  );

  return await Promise.all(
    snapshot.map((server) => scaleServerUp(server.id, server._info.type_name)),
  );
};

const scaleServerUp = async (id: number, serverTypeName: string) => {
  const { server } = await api.server(id);
  const status = server.status;

  if (!(status === "running" || status === "off")) {
    throw new Error(
      `Server ${server.name} is in state ${status}. Must be 'off' or 'running'`,
    );
  }

  if (status === "running") {
    await poweroff(server);
  }

  console.log(`${server.name}: Rescaling ${server.name} to ${serverTypeName}.`);
  await api.rescale(id, serverTypeName);
  console.log(`${server.name}: Rescaling done.`);
};
