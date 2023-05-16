import Head from "next/head";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getApiData, getAuth } from "@/lib-client/utils";
import JobForm from "@/components/JobForm";
import type { Company } from "@prisma/client";

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
    },
  };
};

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { user, sessionId, companiesOptions } = props;
  return (
    <>
      <Head>
        <title>New</title>
      </Head>

      <div className="flex flex-col justify-center items-center">
        <h2 className="mb-6 text-3xl font-bold">New</h2>
        <JobForm
          user={user}
          sessionId={sessionId}
          companiesOptions={companiesOptions}
        />
      </div>
    </>
  );
}
