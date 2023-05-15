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
import { getAuth, getApiData } from "@/lib-client/utils";

type JobWithCompanyName = Job & { company: { name: string } };

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

      {jobs && jobs.map((job, i) => <JobCard key={i} job={job} />)}
    </>
  );
};

export default Index;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<{
    user: User;
    jobs: JobWithCompanyName[];
  }>
> => {
  const auth = await getAuth(context);

  if (!auth) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const { jobs } = await getApiData("jobs", auth.session.sessionId);

  return {
    props: {
      user: auth.user,
      jobs: jobs || [],
    },
  };
};
