import { test, expect } from "@playwright/test";
import type { Company } from "@prisma/client";
import { prisma } from "../../lib-server/prisma";

const headers = {
  cookie: "auth_session=MpsfkdjegOurhsbV2KGXQz0rKNLYJPGCYbudnsJw",
};

test.describe("/api/company route tests", () => {
  test("requires user for access", async ({ request }) => {
    const res = await request.get("/api/company", { headers });
    expect(res.ok()).toBeTruthy();
  });
  test("get request responds with companies of user", async ({ request }) => {
    const res = await request.get("/api/company", { headers });
  });
});
