import { test, expect } from "@playwright/test";
// import type { Company } from "@prisma/client";
import { prisma } from "../../../lib-server/prisma";

const headers = {
  cookie: "auth_session=bmMwyP3tnx5USWIaCmVTHob88yFdKi0Af8a2rIjY",
};

test.describe("/api/company route tests", () => {
  test("requires user for access", async ({ request }) => {
    const res = await request.get("/api/company", { headers });
    expect(res.ok()).toBeTruthy();
  });
  test("get request responds with companies of user", async ({ request }) => {
    await prisma.company.create({
      data: {
        name: "Google",
        image_url: "",
        jobs: {
          create: {
            title: "Software Developer",
            interest: 5,
            status: "APPLIED",
            description: "fake job",
            source: "test",
            user: { connect: { username: "username" } },
          },
        },
        user: {
          connect: { username: "username" },
        },
      },
    });
    const res = await request.get("/api/company", { headers });
  });
});
