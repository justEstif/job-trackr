import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Head from "next/head";
import { getAuth } from "@/lib-client/utils";
import AuthForm from "@/components/AuthForm";

const Index = () => {
  return (
    <>
      <Head>Sign Up</Head>
      <div className="flex flex-col justify-center items-center">
        <h2 className="mb-6 text-3xl font-bold">Sign Up</h2>
        <AuthForm intent={"sign-up"} />
      </div>
    </>
  );
};

export default Index;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> => {
  const auth = await getAuth(context);

  if (auth) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
