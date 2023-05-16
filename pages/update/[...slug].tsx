import Head from "next/head";
import type { Options } from "react-select";
import type { User } from "lucia-auth";
import JobForm from "@/components/JobForm";
import { useRouter } from "next/router";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getApiData, getAuth } from "@/lib-client/utils";
import type { Company, Job } from "@prisma/client";
import UpdateJobForm from "@/components/UpdateJobForm";

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { companiesOptions, job, sessionId, user } = props;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Update</title>
      </Head>

      <div className="flex flex-col justify-center items-center">
        <h2 className="mb-6 text-3xl font-bold">Update</h2>
        <UpdateJobForm
          job={job}
          user={user}
          sessionId={sessionId}
          companiesOptions={companiesOptions}
        />
      </div>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const auth = await getAuth(context);

  if (!auth) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  if (!context.params || !context.params.slug) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { job }: { job: Job & { company: { name: string } } } =
    await getApiData(`jobs/${context.params.slug}`, auth.session.sessionId);

  const { companies }: { companies: Company[] } = await getApiData(
    "company",
    auth.session.sessionId
  );

  const companiesOptions = companies.map((company) => ({
    label: company.name,
    value: company.name,
  }));

  return {
    props: {
      user: auth.user,
      sessionId: auth.session.sessionId,
      companiesOptions,
      job,
    },
  };
};
