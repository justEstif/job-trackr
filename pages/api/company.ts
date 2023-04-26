import { auth } from "../../lib-server/lucia";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

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
  else return res.status(200).send("works");
};
