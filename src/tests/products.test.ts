import { test } from "node:test";
import { equal } from "node:assert/strict";
import { build } from "../../app.ts";
import * as Interfaces from "../../src/interfaces/app.ts";

test("products", async (t) => {
  const optsTest: Interfaces.Opts = { logger: false };
  const app = await build(optsTest);

  t.after(async () => {
    await app.close();
  });

  await t.test("GET /", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/"
    });

    equal(res.statusCode, 200);
    equal(res.headers["content-type"], "application/json; charset=utf-8");
    equal(res.payload, '{"hello":"world"}');
  });
});
