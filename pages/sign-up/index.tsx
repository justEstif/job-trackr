import { auth } from "../../lib-server/lucia";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import AuthForm from "../../components/AuthForm";
import Head from "next/head";

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
  const authRequest = auth.handleRequest(context.req, context.res);
  const session = await authRequest.validate();
  if (session) {
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
