import { auth } from "../../../lib-server/lucia";
import { z } from "zod";
import { LuciaError } from "lucia-auth";
import { Prisma } from "@prisma/client";

import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type Data = {
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return await POST(req, res);
    default:
      return res.status(404).json({ error: "Not found" });
  }
}

const POST: NextApiHandler = async (req, res) => {
  const { body } = req;

  try {
    const { username, password } = z
      .object({
        username: z.string(),
        password: z.string(),
      })
      .parse(JSON.parse(body));

    const user = await auth.createUser({
      primaryKey: {
        providerId: "username",
        providerUserId: username,
        password,
      },
      attributes: {
        username,
      },
    });

    const session = await auth.createSession(user.userId);
    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);
    return res.redirect(302, "/");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.issues,
        dump: error,
      });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.message?.includes("username")
    ) {
      return res.status(400).json({
        error: "Username already in use",
      });
    }
    if (
      error instanceof LuciaError &&
      error.message === "AUTH_DUPLICATE_KEY_ID"
    ) {
      return res.status(400).json({
        error: "Username already in use",
      });
    }
    // database connection error
    console.error(error);
    return res.status(400).json({
      error: "Unknown error occurred",
      dump: error,
    });
  }
};
