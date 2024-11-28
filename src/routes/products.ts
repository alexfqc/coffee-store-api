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

  fastify.get("/", async () => {
    return { hello: "world" };
  });

  fastify.get("/products", async () => {
    try {
      const result = await collection.find().toArray();
      if (result.length === 0) {
        throw new Error("No documents found");
      }
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
      console.log(result);
      return result.insertedId;
    }
  );
}

//ESM
export default fastifyPlugin(routes);
