import { auth } from "../../../lib-server/lucia";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib-server/prisma";

export default async function API(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    default:
      return res.status(404).json({ error: "Not found" });
  }
}

const GET: NextApiHandler = async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  else {
    const { user } = await auth.validateSessionUser(session.sessionId);
    const companies = await prisma.company.findMany({
      where: { user_id: user.userId },
      select: {
        jobs: { select: { id: true } },
      },
    });
    return res.status(200).json({
      companies,
    });
  }
};
