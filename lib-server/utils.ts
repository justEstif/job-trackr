import type { NextApiRequest } from "next";

type ValidCookieKeys = "username" | "auth_session";

const getPropFromHeader =
  (key: ValidCookieKeys) =>
  ({ headers: { cookie } }: NextApiRequest) => {
    if (cookie) {
      const [auth_session, username] = cookie.split(";");
      return key === "username"
        ? username.split("=")[1]
        : auth_session.split("=")[1];
    } else {
      throw new Error("Unauthorized");
    }
  };

export const getUsername = getPropFromHeader("username");
