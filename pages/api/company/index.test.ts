require("next");
import { beforeAll, afterAll, describe, it, expect } from "vitest";
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

async function getCompanies(user: (typeof users)[0], query?: string) {
  const url = `http://localhost:3000/api/company${query && `query?=${query}`}`;
  return fetch(url, {
    headers: { cookie: `${JSON.stringify(user)};` },
  }).then((r) => r.json());
}

describe("GET /api/company", () => {
  beforeAll(async () => {
    await prisma.authUser.createMany({ data: users });
    for (const company of companies) {
      await prisma.company.create({
        data: company,
      });
    }
  });
  afterAll(async () => {
    await prisma.authUser.deleteMany({
      where: {
        username: { in: users.map((user) => user.username) },
      },
    });
  });

  it("returns if valid user", async () => {
    const user = users[0];
    await expect(getCompanies(user)).resolves.not.toThrow();
  });

  it("returns the companies of user", async () => {
    const user = users[0];
    const res = await getCompanies(user);
    expect(res).toHaveProperty("companies");
    for (const company of res.companies) {
      expect(company).toHaveProperty("user_id", `${user.id}`);
    }
  });

  it("returns the companies of a user that match query param", async () => {
    const user = users[0];
    const res = await getCompanies(user, "goo");
    expect(res).toHaveProperty("companies");
    for (const company of res.companies) {
      expect(company).toHaveProperty("user_id", `${user.id}`);
    }
  });
});
