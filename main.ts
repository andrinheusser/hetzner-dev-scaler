import { parseFlags, z } from "./deps.ts";
import down from "./src/tasks/down.ts";
import help from "./src/tasks/help.ts";
import snapshot from "./src/tasks/snapshot.ts";
import up from "./src/tasks/up.ts";

const commandSchema = z.enum(["help", "snapshot", "up", "down"]);

const parsedCommand = commandSchema.safeParse(Deno.args[0] || "help");
if (!parsedCommand.success) {
  console.log("Invalid command");
  Deno.exit(1);
}
const command = parsedCommand.data;

export const flags = parseFlags(Deno.args, {
  boolean: ["verbose"],
});

switch (command) {
  case commandSchema.enum.snapshot:
    await snapshot();
    Deno.exit(0);
    break;
  case commandSchema.enum.up:
    console.log("Scaling up...");
    await up();
    Deno.exit(0);
    break;
  case commandSchema.enum.down:
    console.log("Scaling down...");
    await snapshot();
    await down();
    Deno.exit(0);
    break;
  case commandSchema.enum.help:
  default:
    help();
}
