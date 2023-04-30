import { auth } from "../../../lib-server/lucia";
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
  const { user } = req.body; // TODO is this bad?
  const companies = await prisma.company.findMany({
    where: { user_id: user.userId },
    select: {
      jobs: { select: { id: true } },
    },
  });
  return res.status(200).json({
    companies,
  });
};
