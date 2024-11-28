import { test } from "node:test";
import { equal, deepEqual } from "node:assert/strict";
import { build } from "../../app.ts";
import * as Interfaces from "../../src/interfaces/app.ts";

test("products", async (t) => {
  const optsTest: Interfaces.Opts = { logger: false };
  const app = await build(optsTest);
  const productToBeInserted = { name: "test", quantity: 9, price: 5 };

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
    }
  );

  await t.test("should get products list", async () => {
    const res = await app.inject({
      method: "GET",
      url: "products"
    });

    const productsList = JSON.parse(res.payload);
    const product = productsList[0];

    equal(productsList.length, 1);
    equal(product.name, productToBeInserted.name);
    equal(product.price, productToBeInserted.price);
    equal(product.quantity, productToBeInserted.quantity);
  });
});
