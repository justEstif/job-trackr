require("next");
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { prisma } from "../../../lib-server/prisma";

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

beforeAll(async () => {
  await prisma.authUser.create({
    data: {
      id: "id",
      username: user.username,
    },
  });
});

afterAll(async () => {
  await prisma.authUser.delete({
    where: {
      username: user.username,
    },
  });
});

async function getSignin() {
  return fetch("http://localhost:3000/api/sign-in").then((r) => r.json());
}

async function postSignIn(user: User) {
  return fetch("http://localhost:3000/api/sign-in", {
    method: "POST",
    body: JSON.stringify(user),
  }).then((r) => r.json());
}

describe("/api/sign-in route", () => {
  it("shouldn't have a get response", async () => {
    const res = await getSignin();
    await expect(getSignin()).resolves.not.toThrow();
  });

  it("should sign in user", async () => {
    await expect(postSignIn(user)).resolves.not.toThrow();
  });
});
