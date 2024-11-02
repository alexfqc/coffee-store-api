// @ts-check
import fastify from "fastify";
import * as Interfaces from "./src/interfaces/app.ts";

const getOpts = (): Interfaces.Opts => {
  if (process.stdout.isTTY) {
    return { logger: { transport: { target: "pino-pretty" } } };
  }
  return { logger: true };
};

const opts = getOpts();

const app = fastify(opts);

app.get("/", (): string => {
  return "world";
});

app.listen({ port: 3000 });
