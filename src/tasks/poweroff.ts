import { z } from "../../deps.ts";
import api from "../api/index.ts";
import { serverSchema } from "../api/schemas.ts";

export default async function poweroff(
  { id, name }: z.infer<typeof serverSchema>,
) {
  console.log(`${name}: Shutting down`);
  await api.shutdown(id);
  console.log(`${name}: Shutdown complete. Powering off.`);
  await api.power_off(id);
  console.log(`${name}: Powering off complete.`);
}
