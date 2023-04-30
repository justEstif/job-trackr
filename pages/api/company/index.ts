import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib-server/prisma";
import withUser from "../../../lib-server/middleware/withUser";

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
  if (req.headers.cookie) {
    const { username, userId }: { username: string; userId: string } =
      JSON.parse(req.headers.cookie.split(";")[0]);
    const companies = await prisma.company.findMany({
      where: { user: { username: username } },
      include: {
        jobs: { select: { id: true } },
      },
    });
    return res.status(200).json({
      companies,
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
