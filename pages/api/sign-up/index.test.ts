import { test, expect } from "@playwright/test";
import { prisma } from "../../../lib-server/prisma";

const existingUser = {
  username: "username_new",
  password: "password",
};

const newUser = {
  username: "username",
  password: "password",
};

// add an existing user
test.beforeAll(async () => {
  await prisma.authUser.create({
    data: {
      id: "id",
      username: existingUser.username,
    },
  });
});

test.afterAll(async () => {
  await prisma.authUser.deleteMany({
    where: {
      OR: [{ username: newUser.username }, { username: existingUser.username }],
    },
  });
});

test.describe("/api/sign-up", () => {
  test("should sign up a user", async ({ request }) => {
    const res = await request.post("/api/sign-up", {
      data: { ...newUser },
    });
    expect(res.ok()).toBeTruthy();
  });
  test("should not sign up if username is used", async ({ request }) => {
    const res = await request.post("/api/sign-up", {
      data: { ...existingUser },
    });
    expect(res.ok()).toBeFalsy();
  });
});
