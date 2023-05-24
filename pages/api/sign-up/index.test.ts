require("next");
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { prisma } from "../../../lib-server/prisma";
import { auth } from "../../../lib-server/lucia";

type UserForm = {
  username: string;
  password: string;
};

const existingUser = {
  id: "",
  username: "username_new",
  password: "password",
};

const newUser = {
  id: "",
  username: "username",
  password: "password",
};

// add an existing user
beforeAll(async () => {
  await auth.createUser({
    primaryKey: {
      providerId: "username",
      providerUserId: existingUser.username,
      password: existingUser.password,
    },
    attributes: {
      username: existingUser.username,
    },
  });
});

afterAll(async () => {
  await prisma.authUser.delete({ where: { username: newUser.username } });
  await prisma.authUser.delete({ where: { username: existingUser.username } });
});

async function postSignUp(user: UserForm) {
  return fetch("http://localhost:3000/api/sign-up", {
    method: "POST",
    body: JSON.stringify(user),
  }).then((r) => r.ok);
}

describe.skip("POST /api/sign-up", () => {
  it("should sign up user", async () => {
    await expect(postSignUp(newUser)).resolves.toBeTruthy();
  });
  it("shouldn't sign up user with existing username", async () => {
    await expect(postSignUp(existingUser)).resolves.toBeFalsy();
  });
});
