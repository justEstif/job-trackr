import { test, expect } from "@playwright/test";
import { prisma } from "../../../lib-server/prisma";

const user = {
  id: "id",
  username: "username",
  password: "password",
};

test.beforeAll(async () => {
  await prisma.authUser.create({
    data: {
      id: "id",
      username: user.username,
    },
  });
});

test.afterAll(async () => {
  await prisma.authUser.delete({
    where: {
      username: user.username,
    },
  });
});

test.describe("/api/sign-in route", () => {
  test("shouldn't have a get response", async ({ request }) => {
    const res = await request.get("/api/sign-in");
    expect(res.ok()).toBeFalsy();
  });

  test("should sign in user", async ({ request }) => {
    const res = await request.post("/api/sign-in", {
      data: { ...user },
    });
    expect(res.ok()).toBeTruthy();
  });
});
