export const productsSchema = {
  $id: "products",
  type: "object",
  properties: {
    name: { type: "string" },
    price: { type: "number" },
    quantity: { type: "number" }
  },
  required: ["name", "price", "quantity"],
  additionalProperties: false
};