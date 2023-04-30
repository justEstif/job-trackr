import { test, expect } from "@playwright/test";
import { prisma } from "../../../lib-server/prisma";

const companies = [
  {
    name: "Google",
    user: { connect: { username: "username_1" } },
  },
  {
    name: "Facebook",
    user: { connect: { username: "username_1" } },
  },
  {
    name: "Amazon",
    user: { connect: { username: "username_2" } },
  },
];

const users = [
  {
    id: "user1",
    username: "username_1",
  },
  {
    id: "user2",
    username: "username_2",
  },
];

const headers = {
  cookie: `${JSON.stringify(users[0])};`,
};

test.describe("GET /api/company", () => {
  test.beforeAll(async () => {
    await prisma.authUser.createMany({ data: users });
    for (const company of companies) {
      await prisma.company.create({
        data: company,
      });
    }
  });
  test.afterAll(async () => {
    for (const user of users) {
      await prisma.authUser.delete({
        where: { username: user.username },
      });
    }
  });

  test("will fail if user isn't passed", async ({ request }) => {
    const res = await request.get("/api/company", { headers });
    expect(res.ok()).toBeTruthy();
  });

  test.skip("get all the companies that match the query of the current user", async ({
    request,
  }) => {
    const res = await request.get("/api/company?=goo");
  });

  test.skip("gets all the companies of the current user", async ({
    request,
  }) => {
    const res = await request.get("/api/company");
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: users[0]["id"],
        }),
      ])
    );
  });
});
