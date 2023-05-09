import type { NextApiRequest } from "next";
import { z } from "zod";

export const getUsername = (req: NextApiRequest) => {
  if (req.headers.cookie) {
    const cookie = req.headers.cookie.split(";");
    const username = cookie[cookie.length - 1];
    return username;
  } else {
    throw new Error("Unauthorized");
  }
};

export const getSearch = (req: NextApiRequest) => {
  const { search } = z
    .object({ search: z.string().optional() })
    .parse(req.query);
  return search;
};

export async function isImgUrl(url = "") {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const contentType = res.headers.get("Content-Type");
    return contentType && contentType.startsWith("image");
  } catch (err) {
    return false;
  }
}
