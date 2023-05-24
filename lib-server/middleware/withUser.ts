import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { auth } from "../lucia";

/**
 * Function that get the validated session and user object or null
 */
const getAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const valid = await auth.handleRequest(req, res).validate();
  return valid ? await auth.validateSessionUser(valid.sessionId) : null;
};

const addStringToRequestCookie =
  (key: string) => (value: string) => (req: NextApiRequest) => {
    req.headers.cookie
      ? (req.headers.cookie = `${req.headers.cookie};${key}=${value}`)
      : (req.headers.cookie = `${key}=${value}`);
  };

const addUserNameToCookie = addStringToRequestCookie("username");

const withUser =
  (handler: NextApiHandler): NextApiHandler =>
  async (req, res) => {
    const validAuth = await getAuth(req,res);
    if (!validAuth) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      addUserNameToCookie(validAuth.user.username)(req);
      return handler(req, res);
    }
  };

export default withUser;
