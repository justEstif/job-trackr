import type { NextApiHandler, NextApiResponse } from "next";
import { auth } from "../lucia";

/**
 * @description middleware to be used in testing only
 */
const testMiddleware = (handler: NextApiHandler): NextApiHandler => {
  return (req, res: NextApiResponse) => {
    if (req.headers.cookie) {
      return handler(req, res);
    }
    return res.status(401).json({ error: "Unauthorized" });
  };
};

/**
 * @description middleware to authorize request using lucia
 */
const prodMiddleware = (handler: NextApiHandler): NextApiHandler => {
  return async (req, res: NextApiResponse) => {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      const { user } = await auth.validateSessionUser(session.sessionId);
      req.headers.cookie
        ? (req.headers.cookie = `${JSON.stringify(user)};${req.headers.cookie}`)
        : (req.headers.cookie = JSON.stringify(user));
      return handler(req, res);
    }
  };
};

const withUser = (handler: NextApiHandler): NextApiHandler => {
  if (process.env.TESTING === "true") {
    return testMiddleware(handler);
  } else {
    return prodMiddleware(handler);
  }
};

export default withUser;
