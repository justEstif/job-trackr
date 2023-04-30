import type { NextApiHandler, NextApiResponse } from "next";
import { auth } from "../lucia";

const devMiddleware = (handler: NextApiHandler): NextApiHandler => {
  return (req, res: NextApiResponse) => {
    if (req.headers.cookie) {
      return handler(req, res);
    }
    return res.status(401).json({ error: "Unauthorized" });
  };
};

// use lucia to check if user exists
const prodMiddleware = (handler: NextApiHandler): NextApiHandler => {
  return async (req, res: NextApiResponse) => {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      const { user } = await auth.validateSessionUser(session.sessionId);
      if (req.headers.cookie) {
        req.headers.cookie = `${JSON.stringify(user)};${req.headers.cookie}`;
      } else {
        req.headers.cookie = JSON.stringify(user);
      }
      return handler(req, res);
    }
  };
};

const withUser = (handler: NextApiHandler): NextApiHandler => {
  if (process.env.NODE_ENV === "production") {
    return prodMiddleware(handler);
  } else {
    return devMiddleware(handler);
  }
};

export default withUser;
