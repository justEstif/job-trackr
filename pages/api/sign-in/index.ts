import { auth } from "../../../lib-server/lucia";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { LuciaError } from "lucia-auth";
import { z } from "zod";

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
        username: z.string({ required_error: "Username is required" }),
        password: z.string({ required_error: "Password is required" }),
      })
      .parse(body);
    const authRequest = auth.handleRequest(req, res);
    const key = await auth.useKey("username", username, password);
    const session = await auth.createSession(key.userId);
    authRequest.setSession(session);
    return res.redirect(302, "/");
  } catch (error) {
    if (error instanceof LuciaError) {
      if (
        error.message === "AUTH_INVALID_KEY_ID" ||
        error.message === "AUTH_INVALID_PASSWORD"
      ) {
        return res.status(400).json({
          error: "Incorrect username or password",
        });
      }
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.issues.map((issue) => issue.message).toString(),
      });
    }

    // database connection error
    console.error(error);
    return res.status(500).json({
      error: "Unknown error occurred",
    });
  }
};
