import type { NextApiHandler } from "next";
import { auth } from "../lucia";

const withUser = (handler: NextApiHandler): NextApiHandler => {
  return async (req, res) => {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      const { user } = await auth.validateSessionUser(session.sessionId);
      const userCookie = user.username;
      req.headers.cookie
        ? (req.headers.cookie = `${req.headers.cookie};${userCookie}`)
        : (req.headers.cookie = userCookie);
      return handler(req, res);
    }
  };
};

export default withUser;
