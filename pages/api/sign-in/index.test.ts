require("next");
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { prisma } from "../../../lib-server/prisma";
import { auth } from "../../../lib-server/lucia";

type User = {
  id: string;
  username: string;
  password: string;
};

const user: User = {
  id: "id",
  username: "username",
  password: "password",
};

async function postSignIn(user: User) {
  return fetch("http://localhost:3000/api/sign-in", {
    method: "POST",
    body: JSON.stringify(user),
  }).then((r) => r.ok);
}

beforeAll(async () => {
  await auth.createUser({
    primaryKey: {
      providerId: "username",
      providerUserId: user.username,
      password: user.password,
    },
    attributes: {
      username: user.username,
    },
  });
});

afterAll(async () => {
  await prisma.authUser.delete({ where: { username: user.username } });
});

describe.skip("POST /api/sign-in", () => {
  it("should sign in user", async () => {
    await expect(postSignIn(user)).resolves.toBeTruthy();
  });
});
