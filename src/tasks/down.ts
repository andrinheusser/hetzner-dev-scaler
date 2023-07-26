import { z } from "../../deps.ts";
import api from "../api/index.ts";
import { priceLocationSchema, serverTypeSchema } from "../api/schemas.ts";
import { snapshotSchema } from "../schemas.ts";
import { snapshotFileLocation } from "../utils.ts";
import poweroff from "./poweroff.ts";

const priceForLocation = (
  location: string,
  prices: z.infer<typeof priceLocationSchema>[],
): number | undefined => {
  const p = prices.find((price) => price.location === location);
  if (!p) return undefined;
  return parseFloat(p.price_hourly.net);
};

export default async () => {
  const snapshot = snapshotSchema.parse(
    JSON.parse(Deno.readTextFileSync(snapshotFileLocation)),
  );
  const ids = snapshot.map((server) => server.id);
  const { server_types: serverTypes } = await api.server_types();
  await Promise.all(ids.map((id) => scaleServerDown(id, serverTypes)));
};

const scaleServerDown = async (
  id: number,
  serverTypes: z.infer<typeof serverTypeSchema>[],
) => {
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

  const availableTypes = server.datacenter.server_types.available_for_migration;
  const location = server.datacenter.location.name;
  const candidates = serverTypes.filter((serverType) => {
    return availableTypes.includes(serverType.id) &&
      priceForLocation(location, serverType.prices) !== undefined &&
      serverType.disk >= server.server_type.disk;
  }).sort((a, b) => {
    return priceForLocation(location, a.prices)! -
      priceForLocation(location, b.prices)!;
  });
  const candidate = candidates[0];
  console.log(`${server.name}: Rescaling ${server.name} to ${candidate.name}.`);
  await api.rescale(id, candidate.name);
  console.log(
    `${server.name}: Rescaling done. ${server.name} is now ${candidate.name}`,
  );
  await poweroff(server);
};
