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

type JobWithCompanyName = Job & { company: { name: string } };

async function getJobs(sessionId: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_API}/jobs`;
  try {
    const res = await fetch(url, {
      headers: {
        cookie: `auth_session=${sessionId}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<{
    user: User;
    jobs: JobWithCompanyName[];
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

  const data = await getJobs(session.sessionId);
  const jobs = data.jobs


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

      {jobs && jobs.map((job, i) => (
        <JobCard key={i} job={job} />
      ))}
    </>
  );
};

export default Index;
