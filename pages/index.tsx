import { useRouter } from "next/router";
import { auth } from "../lib-server/lucia";

import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import type { User } from "lucia-auth";
import Head from "next/head";
import type { Job } from "@prisma/client";
import { JobCard } from "@/components/JobCard";

type GetJobs = {
  jobs: (Job & { company: { name: string } })[];
};

async function getJobs(sessionId: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_API}/jobs`;
  try {
    const res = await fetch(url, {
      headers: {
        cookie: `auth_session=${sessionId}`,
      },
    });

    const { jobs }: { jobs: GetJobs } = await res.json();

    return jobs;
  } catch (error) {
    console.log(error);
  }
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<{
    user: User;
    jobs: GetJobs;
  }>
> => {
  const authRequest = auth.handleRequest(context.req, context.res);
  const { user, session } = await authRequest.validateUser();

  if (!user || !session)
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };

  const jobs = await getJobs(session.sessionId);

  return {
    props: {
      user,
      jobs: jobs || [],
    },
  };
};

const Index = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { jobs } = props;

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <h2 className="mb-6 text-3xl font-bold">Home</h2>

      {jobs.map((job, i) => (
        <div key={i} className="mb-6 shadow-xl card bg-base-100 lg:card-side">
          <div className="card-body">
            <h2 className="card-title">{job.title}</h2>
            <small>{job.description}</small>
            <div className="justify-end card-actions">
              <button className="btn btn-primary">View More</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Index;
