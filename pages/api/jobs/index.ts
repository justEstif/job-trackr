import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib-server/prisma";
import { getUsername } from "@/lib-server/util";
import withUser from "@/lib-server/middleware/withUser";
import { Prisma } from "@prisma/client";
import { getJobs } from "./utils";

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

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const username = getUsername(req);
    const jobs = await getJobs(username);
    return res.status(200).json({ jobs });
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
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const username = getUsername(req);
    const { title, description, interest, source, company } = z
      .object({
        title: z.string({ required_error: "Title is required" }),
        description: z.string({ required_error: "description is required" }),
        interest: z
          .number({ required_error: "interest is required" })
          .min(0)
          .max(5),
        source: z.string({ required_error: "source is required" }),
        company: z.string({ required_error: "company is required" }),
      })
      .parse(req.body);
    const job = await prisma.job.create({
      data: {
        title,
        description,
        interest,
        source,
        user: { connect: { username } },
        company: {
          connectOrCreate: {
            where: { name: company },
            create: { name: company, user: { connect: { username } } },
          },
        },
      },
    });

    return res.status(201).json({ job });
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
}
