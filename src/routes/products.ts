import fastifyPlugin from "fastify-plugin";
import { productsSchema } from "../schemas/products";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify): Promise<void> {
  const collection = fastify.mongo.db.collection("products");

  fastify.addSchema(productsSchema);

  fastify.get("/products", async () => {
    try {
      const result = await collection.find().toArray();
      return result;
    } catch (e) {
      return e.message;
    }
  });

  fastify.post(
    "/products",
    {
      schema: {
        body: { $ref: "products#" }
      }
    },
    async (request) => {
      const result = await collection.insertOne(request.body);
      return result.insertedId;
    }
  );
}

export default fastifyPlugin(routes);
