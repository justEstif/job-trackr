import Head from "next/head";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getAuth } from "@/lib-client/utils";
import JobForm from "@/components/JobForm";

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
