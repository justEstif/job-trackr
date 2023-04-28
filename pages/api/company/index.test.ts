import { test, expect } from "@playwright/test";
// import type { Company } from "@prisma/client";
import { prisma } from "../../../lib-server/prisma";

const headers = {
  cookie: "auth_session=ckV8mGD2H1mcAK0zv4IaaPN3ZZyB3dPfC9tCPArO",
};

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

test.describe("/api/company route tests", () => {
  test("requires user for access", async ({ request }) => {
    const res = await request.get("/api/company", { headers });
    expect(res.ok()).toBeTruthy();
  });
  test.skip("get request responds with companies of user", async ({
    request,
  }) => {
    await prisma.company.create({
      data: {
        name: "Google",
        jobs: {},
        user: { connect: { username: "username" } },
      },
    });
    const res = await request.get("/api/company", { headers });
  });
});
