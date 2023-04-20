import { test, expect } from "@playwright/test";
import prismaClient from "../../../lib-server/prisma";

const fakeUser = {
  username: "username",
  password: "password",
};

test.afterAll(async () => {
  await prismaClient.authUser.delete({
    where: {
      username: fakeUser.username,
    },
  });
});

test("should create a new user", async ({ request }) => {
  const signUp = await request.post(`/api/auth/sign-up`, {
    data: {
      ...fakeUser,
    },
  });
  expect(signUp.ok()).toBeTruthy();
});
