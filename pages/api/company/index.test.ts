require("next");
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { prisma } from "../../../lib-server/prisma";
import { auth } from "../../../lib-server/lucia";

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
    id: "",
    username: "username_1",
    password: "password",
  },
  {
    id: "",
    username: "username_2",
    password: "password",
  },
];

async function getCompanies(user: (typeof users)[0], query?: string) {
  let url = `http://localhost:3000/api/company${query ? `?search=${query}` : ""
    }`;
  const key = await auth.useKey("username", user.username, user.password);
  const session = await auth.createSession(key.userId);
  return fetch(url, {
    headers: { cookie: `auth_session=${session.sessionId};` },
  }).then((r) => r.json());
}

describe("GET /api/company", () => {
  beforeAll(async () => {
    for (const user of users) {
      await auth
        .createUser({
          primaryKey: {
            providerId: "username",
            providerUserId: user.username,
            password: user.password,
          },
          attributes: {
            username: user.username,
          },
        })
        .then((newUser) => {
          user.id = newUser.userId;
        });
    }

    for (const company of companies) {
      await prisma.company.create({ data: company });
    }
  });
  afterAll(async () => {
    await prisma.authUser.deleteMany({
      where: { username: { in: users.map((user) => user.username) } },
    });
  });

  it("returns if valid user", async () => {
    const user = users[0];
    await expect(getCompanies(user)).resolves.toBeTruthy();
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
    const search = "goo";
    const res = await getCompanies(user, search);
    expect(res).toHaveProperty("companies");
    for (const company of res.companies) {
      expect(company).toHaveProperty("user_id", `${user.id}`);
      expect(company.name.toLowerCase()).toContain(search.toLowerCase());
    }
  });
});
