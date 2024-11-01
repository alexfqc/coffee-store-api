// @ts-check
import fastify from "fastify";

const app = fastify();

app.get("/", (): string => {
  return "world";
});

app.listen({ port: 3000 });
