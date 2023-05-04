import { auth } from "../../lib-server/lucia";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import AuthForm from "../../components/AuthForm";
import Head from "next/head";

export default function SignInPage() {
  return (
    <section>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex flex-col justify-center items-center">
        <h2 className="mb-6 text-3xl font-bold">Sign in</h2>
        <AuthForm intent={"sign-in"} />
      </div>
    </section>
  );
}

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
