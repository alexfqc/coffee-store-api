import { test } from "node:test";
import { equal, deepEqual, ok } from "node:assert/strict";
import { build } from "../../app.ts";
import * as Interfaces from "../../src/interfaces/app.ts";

test("products", async (t) => {
  const optsTest: Interfaces.Opts = { logger: false };
  const app = await build(optsTest);
  const productToBeInserted = { name: "test", quantity: 9, price: 5 };
  let addedID = "";

  t.before(async () => {
    await app.mongo.db?.collection("products").drop();
  });

  t.after(async () => {
    await app.close();
  });

  await t.test("get empty products", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/products"
    });

    equal(res.statusCode, 200);
    equal(res.headers["content-type"], "application/json; charset=utf-8");
    deepEqual(JSON.parse(res.payload), []);
  });

  await t.test("error when send wrong data to products POST", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/products",
      payload: { name: "test", quantity: 9 }
    });
    equal(res.statusCode, 400);
  });

  await t.test(
    "should save product properly when data is correct",
    async () => {
      const res = await app.inject({
        method: "POST",
        url: "products",
        payload: productToBeInserted
      });
      equal(res.statusCode, 200);

      const getRes = await app.inject({
        method: "GET",
        url: `products/${addedID}`
      });

      const product = JSON.parse(getRes.payload);

      ok(res.body, product._id);
    }
  );

  await t.test("should get products list", async () => {
    const res = await app.inject({
      method: "GET",
      url: "products"
    });

    const productsList = JSON.parse(res.payload);
    const product = productsList[0];
    addedID = product._id;

    equal(productsList.length, 1);
    equal(product.name, productToBeInserted.name);
    equal(product.price, productToBeInserted.price);
    equal(product.quantity, productToBeInserted.quantity);
  });

  await t.test("should get one product", async () => {
    const res = await app.inject({
      method: "GET",
      url: `products/${addedID}`
    });

    const product = JSON.parse(res.payload);

    equal(res.statusCode, 200);
    equal(product.name, productToBeInserted.name);
    equal(product.price, productToBeInserted.price);
    equal(product.quantity, productToBeInserted.quantity);
  });

  await t.test(
    "should return an error if user tries to remove a product that does not exist",
    async () => {
      const res = await app.inject({
        method: "DELETE",
        url: "products/1"
      });

      equal(res.statusCode, 404);
    }
  );

  await t.test("should return ok if product was removed properly", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `products/${addedID}`
    });

    equal(res.payload, "ok");
  });
});
