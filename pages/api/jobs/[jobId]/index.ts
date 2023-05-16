import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib-server/prisma";
import { getSearch, getUsername } from "@/lib-server/util";
import withUser from "@/lib-server/middleware/withUser";
import { Prisma } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "PUT":
      return await PUT(req, res);
    default:
      return res.status(404).json({ error: "Not found" });
  }
}

export default withUser(handler);

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const username = getUsername(req);
    const { jobId } = z
      .object({ jobId: z.string().optional() })
      .parse(req.query);

    const job = await prisma.job.findFirst({
      where: { id: jobId, user: { username } },
      include: { company: { select: { name: true } } },
    });

    return res.status(200).json({ job });
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

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { jobId } = z
      .object({ jobId: z.string().optional() })
      .parse(req.query);

    const { title, description, interest, source, company, userId } = z
      .object({
        title: z.string({ required_error: "Title is required" }),
        description: z.string({ required_error: "description is required" }),
        interest: z
          .number({ required_error: "interest is required" })
          .min(0)
          .max(5),
        source: z.string({ required_error: "source is required" }),
        company: z.string({ required_error: "company is required" }),
        userId: z.string({ required_error: "user_id is required" }),
      })
      .parse(req.body);

    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        description,
        interest,
        source,
        user: { connect: { id: userId } },
        company: {
          connectOrCreate: {
            where: { companyIdentifier: { name: company, user_id: userId } },
            create: { name: company, user: { connect: { id: userId } } },
          },
        },
      },
    });

    return res.status(200).json({ job });
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
