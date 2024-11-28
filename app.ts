// @ts-check
import fastify, { FastifyInstance } from "fastify";
import fastifyMongo from "@fastify/mongodb";
import fastifyAutoload from "@fastify/autoload";
import * as Interfaces from "./src/interfaces/app.ts";

export const build = async (
  opts: Interfaces.Opts
): Promise<FastifyInstance> => {
  const app = fastify(opts);

  app.register(fastifyMongo, {
    forceClose: true,
    url: "mongodb://localhost:27017/crud"
  });

  app.setNotFoundHandler(async (_, reply) => {
    reply.code(404);
    return { error: "Not found" };
  });

  await app.register(fastifyAutoload, {
    dir: `${import.meta.dirname}/src/routes`
  });

  return app;
};
