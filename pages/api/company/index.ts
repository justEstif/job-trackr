import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib-server/prisma";
import withUser from "@/lib-server/middleware/withUser";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    default:
      return res.status(404).json({ error: "Not found" });
  }
}
export default withUser(handler);

const GET: NextApiHandler = async (req, res) => {
  try {
    if (req.headers.cookie) {
      const { username } = z
        .object({ username: z.string() })
        .parse(JSON.parse(req.headers.cookie.split(";")[0]));
      const companies = await prisma.company.findMany({
        where: { user: { username: username } },
        include: { jobs: { select: { id: true } } },
      });
      return res.status(200).json({ companies });
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.issues.map((issue) => issue.message).toString(),
      });
    } else if (error instanceof Error) {
      return res.status(400).json({
        error: error,
      });
    }
    console.error(error);
    return res.status(500).json({
      error: "Server error",
    });
  }
};
