import type { User } from "lucia-auth";
import type { NextApiHandler, NextApiResponse } from "next";
import { auth } from "../lucia";

const withUser = (handler: NextApiHandler): NextApiHandler => {
  return async (req, res: NextApiResponse) => {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      const { user } = await auth.validateSessionUser(session.sessionId);
      req.body.user = user;
      return handler(req, res);
    }
  };
};

export default withUser;
