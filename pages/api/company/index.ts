import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib-server/prisma";
import withUser from "@/lib-server/middleware/withUser";
import { Prisma } from "@prisma/client";
import { getUsername, isImgUrl } from "@/lib-server/util";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "POST":
      return await POST(req, res);
    default:
      return res.status(404).json({ error: "Not found" });
  }
}

export default withUser(handler);

const getSearch = (req: NextApiRequest) => {
  const { search } = z
    .object({ search: z.string().optional() })
    .parse(req.query);
  return search;
};

const GET: NextApiHandler = async (req, res) => {
  try {
    const username = getUsername(req);
    const search = getSearch(req);

    const companies = await prisma.company.findMany({
      where: {
        AND: [
          { user: { username: username } },
          search ? { name: { startsWith: search, mode: "insensitive" } } : {},
        ],
      },
      include: { jobs: { select: { id: true } } },
    });
    return res.status(200).json({ companies });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.issues.map((issue) => issue.message).toString(),
      });
    } else if (error instanceof Error) {
      return res.status(400).json({
        error: error,
      });
    }
    console.error(error);
    return res.status(500).json({
      error: "Server error",
    });
  }
};

const POST: NextApiHandler = async (req, res) => {
  try {
    const username = getUsername(req);
    const { name, image_url } = z
      .object({
        name: z.string({ required_error: "Username is required" }),
        image_url: z
          .string()
          .optional()
          .refine((data) => isImgUrl(data)),
      })
      .parse(req.body);
    const company = await prisma.company.create({
      data: {
        name,
        image_url: image_url || null,
        user: { connect: { username } },
      },
    });
    return res.status(201).json({ company });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error,
      });
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.message?.includes("companyIdentifier")
    ) {
      return res.status(400).json({
        error: "Company name already in use",
      });
    }
    console.error(error);
    return res.status(500).json({
      error: "Server error",
    });
  }
};
