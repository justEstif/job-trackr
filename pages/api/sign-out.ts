import { auth } from "../../lib-server/lucia";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST")
    return res.status(404).json({ error: "Not found" });
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  await auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);
  return res.redirect(302, "/");
}
