import { test } from "node:test";
import { equal, deepEqual } from "node:assert/strict";
import { build } from "../../app.ts";
import * as Interfaces from "../../src/interfaces/app.ts";

test("products", async (t) => {
  const optsTest: Interfaces.Opts = { logger: false };
  const app = await build(optsTest, true);

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
});
