import { prisma } from "@/lib-server/prisma";

/**
 * Get the jobs for the user
 * @param string username - The username of the user
 * @returns jobs
 */
export const getJobs = async (username: string) => {
  const jobs = await prisma.job.findMany({
    where: {
      user: { username: username },
    },
    include: { company: { select: { name: true } } },
  });
  return jobs;
};
