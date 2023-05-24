require("next");
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { prisma } from "../../../lib-server/prisma";
import { auth } from "../../../lib-server/lucia";

type User = {
  id: null | string;
  username: string;
  password: string;
};

type Company = {
  name: string;
  image_url?: string;
  user?: { connect: { username: string } };
};

const companies: Company[] = [
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

const users: User[] = [
  {
    id: null,
    username: "username_1",
    password: "password",
  },
  {
    id: null,
    username: "username_2",
    password: "password",
  },
];

async function getCookie(user: User) {
  const key = await auth.useKey("username", user.username, user.password);
  const session = await auth.createSession(key.userId);
  return `auth_session=${session.sessionId};`;
}

async function getCompanies(user: User, query?: string) {
  const baseUrl = "http://localhost:3000/api/company";
  const search = query ? `?search=${query}` : "";
  const url = baseUrl + search;
  const cookie = await getCookie(user);
  return fetch(url, { headers: { cookie } }).then((r) => r.json());
}

async function postCompanies(
  user: User,
  company: Company,
  cb: (r: Response) => void
) {
  let url = "http://localhost:3000/api/company";
  const cookie = await getCookie(user);
  return fetch(url, {
    headers: { cookie },
    method: "POST",
    body: JSON.stringify(company),
  }).then((r) => cb(r));
}

async function createUsers() {
  for (const user of users) {
    await auth
      .createUser({
        primaryKey: {
          providerId: "username",
          providerUserId: user.username,
          password: user.password,
        },
        attributes: { username: user.username },
      })
      .then((newUser) => {
        user.id = newUser.userId;
      });
  }
}

async function createCompanies() {
  for (const company of companies) {
    await prisma.company.create({ data: company });
  }
}

async function deleteUsers() {
  await prisma.authUser.deleteMany({
    where: { username: { in: users.map((user) => user.username) } },
  });
}

beforeAll(async () => {
  await createUsers();
});

afterAll(async () => {
  await deleteUsers();
});

describe.skip("GET /api/company", () => {
  beforeAll(async () => {
    await createCompanies();
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
      expect(company).toHaveProperty("user_id", user.id);
    }
  });

  it("returns the companies of a user that match query param", async () => {
    const user = users[0];
    const search = "goo";
    const res = await getCompanies(user, search);
    expect(res).toHaveProperty("companies");
    for (const company of res.companies) {
      expect(company).toHaveProperty("user_id", user.id);
      expect(company.name.toLowerCase()).toContain(search.toLowerCase());
    }
  });
});

describe("POST /api/company", () => {
  it("return the new company of user", async () => {
    const user = users[0];
    const company = {
      name: "Spotify",
      image_url:
        "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png",
    };
    const received = await postCompanies(
      user,
      company,
      (res: Response) => res.ok
    );

    expect(received).toBeTruthy();
  });
});
