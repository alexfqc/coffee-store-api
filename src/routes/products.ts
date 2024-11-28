import fastifyPlugin from "fastify-plugin";
import { productsSchema } from "../schemas/products.ts";
import { ObjectId } from "mongodb";
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
      throw new Error(e);
    }
  });

  fastify.get("/products/:id", async (request) => {
    try {
      const { id } = request.params;
      const result = await collection.findOne({ _id: new ObjectId(id) });
      return result;
    } catch (e) {
      throw new Error(e);
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
      try {
        const result = await collection.insertOne(request.body);
        return result.insertedId;
      } catch (e) {
        throw new Error(e);
      }
    }
  );

  fastify.delete("/products/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount <= 0) {
        return reply.status(404).send(new Error("Product doesn't exist"));
      }
      return "ok";
    } catch (e) {
      return reply.status(404).send(new Error("Product doesn't exist"));
    }
  });
}

export default fastifyPlugin(routes);
