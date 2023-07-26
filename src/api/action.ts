import { z } from "../../deps.ts";
import { flags } from "../../main.ts";
import client, { ClientResponse } from "./client.ts";
import { actionSchema } from "./schemas.ts";

const apiActionSchema = z.object({
  action: actionSchema,
});

export default async (
  path: string,
  init?: RequestInit,
): Promise<ClientResponse> => {
  const response = await client(path, init);
  const { action } = apiActionSchema.parse(response.data);

  await handleAction(action);

  return {
    ok: true,
    status: response.status,
    statusText: response.statusText,
    data: true,
  };
};

const resources = (action: z.infer<typeof actionSchema>) => {
  return action.resources.map((resource) => `${resource.type}(${resource.id})`)
    .join(", ");
};

const handleAction = (action: z.infer<typeof actionSchema>) => {
  if (action.progress === 100 || action.finished) {
    if (flags.verbose) {
      console.log(`${action.command}: ${resources(action)} - done`);
    }
    return action;
  }
  if (action.error) {
    console.log(`Error: ${action.command}: ${resources(action)}`);
    throw new Error(action.error.message);
  }
  if (flags.verbose) {
    console.log(
      `${action.command}: ${resources(action)} - (${action.progress}%)`,
    );
  }
  return new Promise((resolve) => {
    setTimeout(async () => {
      const stateResponse = await client(
        `servers/${action.resources[0].id}/actions/${action.id}`,
      );
      const updatedAction = apiActionSchema.parse(stateResponse.data).action;
      resolve(handleAction(updatedAction));
    }, 2000);
  });
};
