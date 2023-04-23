import { test, expect } from "@playwright/test";
import { prisma } from "../../lib-server/prisma";

const fakeUser = {
  id: "id",
  username: "username",
  password: "password",
};

test.beforeAll(async () => {
  await prisma.authUser.create({
    data: {
      id: "id",
      username: fakeUser.username,
    },
  });
});

test.afterAll(async () => {
  await prisma.authUser.delete({
    where: {
      username: fakeUser.username,
    },
  });
});

test("should sign in user", async ({ request }) => {
  const res = await request.post("/api/sign-in", {
    data: {
      ...fakeUser,
    },
  });
  expect(res.ok()).toBeTruthy();
});
