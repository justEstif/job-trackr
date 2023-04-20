import { test, expect } from "@playwright/test";

test("should return hello", async ({ request }) => {
  const res = await request.get("/api/hello");
  const expected = {
    data: "Hello",
  };

  expect(res.ok()).toBeTruthy();
  expect(await res.json()).toMatchObject(expect.objectContaining(expected));
});
