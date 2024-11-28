// @ts-check
import * as Interfaces from "./src/interfaces/app.ts";
import { build } from "./app.ts";

const getOpts = (): Interfaces.Opts => {
  if (process.stdout.isTTY) {
    return { logger: { transport: { target: "pino-pretty" } } };
  }
  return { logger: true };
};

const opts = getOpts();

const app = await build(opts);

await await app.listen({ port: 3000 });
